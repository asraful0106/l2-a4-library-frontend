import { cn } from "@/lib/utils";
import type { IBook } from "@/types/IBook";
import { BadgeCheckIcon, CircleX, HandCoins, PenLine, Trash2 } from "lucide-react";
import { useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { HashLoader } from "react-spinners";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBorrowABookMutation, useDeleteABookMutation, useEditABookMutation } from "@/redux/api/baseApi";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import { Link, useNavigate } from "react-router";
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const EachBook = ({ data }: { data: IBook }) => {
    const navigation = useNavigate();
    const [focus, setFocus] = useState(false);
    const handleMouseEnter = () => {
        setFocus(true);
    };

    const handleMouseLeave = () => {
        setFocus(false);
    };


    // For handeling the edit modal
    const [isEditData, setIsEditData] = useState<boolean>(false);

    const FormSchema = z.object({
        title: z.string().min(1, {
            message: 'Title is required'
        }),
        author: z.string().min(1, {
            message: 'Author is required'
        }),
        genre: z.enum(["FICTION", "NON_FICTION", "SCIENCE", "BIOGRAPHY", "FANTASY"], {
            message: 'Genre should be "FICTION", "NON_FICTION", "SCIENCE", "BIOGRAPHY", "FANTASY"'
        }),
        isbn: z.string().min(1, {
            message: 'ISBN is required'
        }),
        copies: z.number().min(1, {
            message: 'Copies should be a positive number'
        }),
        description: z.string().optional(),
        available: z.boolean().optional(),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            ...data
        },
    });

    // For handeling the edit book data
    const [editABook, { isLoading }] = useEditABookMutation();
    const handleEdit = async (formData: z.infer<typeof FormSchema>) => {
        const res = await editABook({
            ...data,
            ...formData,
            available: formData.copies > 0 ? true : false
        });

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
            toast.success('New book added successfully!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            form.reset();
            setIsEditData(false);
        }
    }

    // For handeling the delete
    const [deleteABook] = useDeleteABookMutation();

    const handleDelete = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteABook(data._id);
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
            }
        });
    }

    // For handeling borrow 
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
            form.reset();
            setIsBorrowBook(false);
            navigation('/borrow-summary');
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
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave} className={cn("h-[34rem] w-fit rounded-b")}>
            <div className="relative">
                <div className={cn("h-[23rem] w-[16rem]", { "brightness-75": focus })}>
                    <img className="w-full h-full object-cover" src="https://booklovers.ancorathemes.com/wp-content/uploads/2020/05/book5-copyright.jpg" alt="" />
                </div>
                {
                    focus &&
                    <div className="absolute top-1/2 left-1/2 -translate-1/2 flex gap-2 z-10">

                        {/* For Editing a book */}
                        <Dialog open={isEditData} onOpenChange={setIsEditData}>
                            <DialogTrigger asChild>
                                <div className="p-2 rounded-full bg-white">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <PenLine className="hover:text-green-500" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Edit</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">

                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(handleEdit)} className="w-2/3 space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Title</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Book Title" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="author"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Author</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Author Name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="genre"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Genre</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Genre" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="FICTION">Fiction</SelectItem>
                                                            <SelectItem value="NON_FICTION">Non Fiction</SelectItem>
                                                            <SelectItem value="FANTASY">Fantasy</SelectItem>
                                                            <SelectItem value="SCIENCE">Science</SelectItem>
                                                            <SelectItem value="BIOGRAPHY">Biography</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="isbn"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>ISBN</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="ISBN Number" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="copies"
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
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="About The Book"
                                                            className="resize-none"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit">Submit</Button>
                                    </form>
                                </Form>
                                {/* Spinner for data loading */}
                                {
                                    isLoading &&
                                    <div className="absolute top-1/2 left-1/2 -translate-1/2">
                                        <HashLoader />
                                    </div>
                                }
                            </DialogContent>
                        </Dialog>

                        {/* For Deleting the book */}
                        <div onClick={handleDelete} className="p-2 rounded-full bg-white">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Trash2 className="hover:text-green-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Delete</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        {/* For borrow a book */}
                        <Dialog open={isBorrowBook} onOpenChange={setIsBorrowBook}>
                            <DialogTrigger asChild>
                                <div className="p-2 rounded-full bg-white">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <HandCoins className="hover:text-green-500" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Borrow Book</p>
                                        </TooltipContent>
                                    </Tooltip>
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
                }
            </div>
            <div className="px-2">
                <Link to={`books/${data?._id}`}>
                    <h1 className="mt-4 text-center font-semibold text-lg hover:cursor-pointer hover:underline">{data?.title}</h1></Link>
                <div className="mt-2 flex items-center justify-between">
                    <p className="text-[14px] text-red-500 font-bold">Copies: {data?.copies}</p>
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
                    {/* <p className="text-[12px] "></p> */}
                </div>
                <div className="mt-4">
                    <p className="text-[12px]"> Author: {data?.author}</p>
                    <p className="text-[12px]">Genre: {data?.genre}</p>
                    <p className="text-[12px]">ISBN: {data?.isbn}</p>
                </div>
            </div>

        </div>
    );
};

export default EachBook;