import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useBorrowABookMutation, useGetBookByIdQuery } from "@/redux/api/baseApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheckIcon, CalendarIcon, CircleX } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import z from "zod";

import { format } from "date-fns"

const BorrowBook = () => {
    const { bookId } = useParams();
    // console.log("Id: ", id)
    const { data: getData, isLoading: isDataLoading, isError } = useGetBookByIdQuery(bookId);
    const data = getData?.data;

    const [isBorrowBook, setIsBorrowBook] = useState<boolean>(false);
        const FormSchemaForBrowing = z.object({
            // book: z.string().min(1, {
            //     message: "Book ID is required"
            // }),
            quantity: z.number().min(1, {
                message: 'Copies should be a positive number'
            }),
            dueDate: z.date({
                message: 'Date is required'
            }),
        });
    
        const formForBorrow = useForm<z.infer<typeof FormSchemaForBrowing>>({
            resolver: zodResolver(FormSchemaForBrowing),
            defaultValues: {
                quantity: 0,
                dueDate: undefined
            },
        });
    
        const [borrowBook, { isLoading: createBorrowBookLoading }] = useBorrowABookMutation();
    
        const handleBorrowBook = async (formDataForBorrow: z.infer<typeof FormSchemaForBrowing>) => {
            const res = await borrowBook({
                ...formDataForBorrow,
                dueDate: formDataForBorrow.dueDate?.toISOString(),
                book: data._id,
            });
    
            console.log("Borrow Res: ", res);
    
            if (res?.error) {
                toast.error('Something went wrong!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
            if (!res?.error) {
                toast.success('Borrowed successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                formForBorrow.reset();
                setIsBorrowBook(false);
            }
            if (
                res?.error &&
                typeof res.error === "object" &&
                "data" in res.error &&
                (res.error as { data?: { message?: string } }).data?.message === "Not enough Book to borrow."
            ) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Can't borrow more than the available quantity!",
                });
            }
        }
    return (
        <div>
            {
                isDataLoading &&
                <div className="min-w-screen min-h-screen flex items-center justify-center">
                    <HashLoader />
                </div>
            }
            {
                isError &&
                <div className="min-w-screen min-h-screen flex items-center justify-center">
                    <h1 className="text-3xl text-gray-400">Some Thing Wrong!</h1>
                </div>
            }
            {
                !isDataLoading && !isError &&
                <div className="flex flex-col-reverse md:flex-row items-center justify-center ml-10 md:ml-0 gap-6 px-6 min-w-screen min-h-screen">
                    {/* Information */}
                    <div>
                        <div className="min-w-[30rem] ml-24 md:ml-0">
                            <h1 className="text-4xl font-semibold">{data?.title}</h1>

                            <p className="mt-4 max-w-[50rem] text-gray-400">{data?.description}</p>
                            <div className="mt-8 flex flex-col gap-1">
                                <p className="font-semibold text-black"><span className="text-gray-400">Author: </span>{data?.author}</p>
                                <p className="font-semibold text-black"><span className="text-gray-400">Copies: </span>{data?.copies}</p>
                                <p className="font-semibold text-black"><span className="text-gray-400">Genre: </span>{data?.genre}</p>
                                <p className="font-semibold text-black"><span className="text-gray-400">ISBN: </span>{data?.isbn}</p>
                                <Badge
                                    variant="secondary"
                                    className={cn("text-white", {
                                        "bg-green-500": data?.available,
                                        "bg-red-500": !data?.available,
                                    })}
                                >
                                    {data?.available ? <BadgeCheckIcon /> : <CircleX />}
                                    {data?.available ? "Available" : "Not Available"}
                                </Badge>

                                {/* Edit Option */}
                                <Dialog open={isBorrowBook} onOpenChange={setIsBorrowBook}>
                                    <DialogTrigger asChild>
                                        <div className="mt-6 flex items-center justify-center">
                                            <Button className="px-[20%]">Borrow Book</Button>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">

                                        <Form {...formForBorrow}>
                                            <form onSubmit={formForBorrow.handleSubmit(handleBorrowBook)} className="w-2/3 space-y-6">

                                                <FormField
                                                    control={formForBorrow.control}
                                                    name="quantity"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Copies</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="Total Book Copies"
                                                                    {...field}
                                                                    onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={formForBorrow.control}
                                                    name="dueDate"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Date of return</FormLabel>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={cn(
                                                                                "w-[240px] pl-3 text-left font-normal",
                                                                                !field.value && "text-muted-foreground"
                                                                            )}
                                                                        >
                                                                            {field.value ? (
                                                                                format(field.value, "PPP")
                                                                            ) : (
                                                                                <span>Pick a date</span>
                                                                            )}
                                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0" align="start">
                                                                    <Calendar
                                                                        mode="single"
                                                                        onSelect={field.onChange}
                                                                        disabled={(date) =>
                                                                            date < new Date() || date < new Date("1900-01-01")
                                                                        }
                                                                        captionLayout="dropdown"
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="submit">Borrow</Button>
                                            </form>
                                        </Form>
                                        {/* Spinner for data loading */}
                                        {
                                            createBorrowBookLoading &&
                                            <div className="absolute top-1/2 left-1/2 -translate-1/2">
                                                <HashLoader />
                                            </div>
                                        }
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                    {/* Imgae */}
                    <div className="w-[25rem] ml-10 md:ml-0">
                        <img src="https://booklovers.ancorathemes.com/wp-content/uploads/2020/05/book5-copyright.jpg" alt="" className="w-full h-full object-cover" />
                    </div>

                </div>
            }
        </div>
    );
}

export default BorrowBook;