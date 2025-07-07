import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useEditABookMutation, useGetBookByIdQuery } from "@/redux/api/baseApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheckIcon, CircleX } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";
import z from "zod";

const BorrowBook = () => {
    const { id } = useParams();
    // console.log("Id: ", id)
    const { data: getData, isLoading: isDataLoading, isError } = useGetBookByIdQuery(id);
    const data = getData?.data;

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
    const [editABook, { isLoading, error }] = useEditABookMutation(data);
    const handleEdit = async (formData: z.infer<typeof FormSchema>) => {
        const res = await editABook({
            ...data,
            ...formData,
            available: formData.copies > 0 ? true : false
        });

        if (error) {
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
                                <Dialog open={isEditData} onOpenChange={setIsEditData}>
                                    <DialogTrigger asChild>
                                        <div className="mt-6 flex items-center justify-center">
                                            <Button className="px-[20%]">Edit</Button>
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