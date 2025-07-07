import RotatingText from "@/components/reactBits/RotatingText";
import BookCarousel from "./BookCarousel";
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import EachBook from "./EachBook";
import { useCreateABookMutation, useGetAllBookQuery } from "@/redux/api/baseApi";
import type { IBook } from "@/types/IBook";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea"
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import { HashLoader } from "react-spinners";


const Book = () => {
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
    });


    // For creating new book
    const [createABook, { isLoading: isLoadingforCreatig, isError }] = useCreateABookMutation();
    // State for handeling the add book dialog
    const [newDataForm, setNewDataForm] = useState<boolean>(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            author: "",
            genre: undefined,
            isbn: "",
            copies: 0,
            description: ""
        },
    });

     async function onSubmit(data: z.infer<typeof FormSchema>) {
        const res = await createABook(data);
        // console.log("Res: " ,res);
        if (isError) {
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
        if(!res?.error){
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
            setNewDataForm(false);
        }
    }
    
    //   Featching Data From API
    const { data } = useGetAllBookQuery(undefined);
    let bookData: IBook[] = data?.data;
    // State for doing filter
    const [filter, setFilter] = useState<string>('all');
    // Filter Logic
    if (filter === "FICTION") {
        bookData = bookData.filter(book => book.genre == "FICTION");
    } else if (filter === "NON_FICTION") {
        bookData = bookData.filter(book => book.genre == "NON_FICTION");
    } else if (filter === "SCIENCE") {
        bookData = bookData.filter(book => book.genre == "SCIENCE");
    } else if (filter === "BIOGRAPHY") {
        bookData = bookData.filter(book => book.genre == "BIOGRAPHY");
    } else if (filter === "FANTASY") {
        bookData = bookData.filter(book => book.genre == "FANTASY");
    } else if (filter === "all") {
        bookData = data?.data;
    }
    // console.log("F: ", bookData);
    return (
        <div>
            {/* Carousel Part */}
            <div className="mt-6 md:mt-10 relative rounded overflow-hidden">
                <BookCarousel />
                <div className="absolute top-[30%] left-[24.2%] md:top-[40%] md:left-[30%] lg:top-1/2 lg:left-[40%]">
                    <div className="flex items-center gap-2 flex-col md:flex-row w-[90%] md:w-full">
                        <h1 className="text-sm text-white font-bold">Favorite Book</h1>
                        <RotatingText
                            texts={['Endless Journeys Begin Here.',
                                '— Where Every Page Inspires.',
                                'Your Gateway to New Worlds.',
                                'Fueling Minds One Story at a Time.',
                                "— Find Your Next Life-Changing Read."]}
                            mainClassName=" text-sm px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                            staggerFrom={"last"}
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "-120%" }}
                            staggerDuration={0.025}
                            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                            transition={{ type: "spring", damping: 30, stiffness: 400 }}
                            rotationInterval={2000}
                        />
                    </div>
                </div>
            </div>
            {/* Book Part */}
            <div>
                <div className="mt-15 px-6 w-full flex items-center gap-6 lg:gap-0 lg:justify-between flex-col lg:flex-row overflow-hidden">
                    <h1 className="text-lg md:text-2xl lg:text-4xl">Uncover Your Next Favorite Book</h1>
                    <div className="flex items-center gap-1.5 md:gap-6">
                        <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
                            <TabsList>
                                <TabsTrigger onClick={() => setFilter("all")} value="all">All</TabsTrigger>
                                <TabsTrigger onClick={() => setFilter("FICTION")} value="FICTION">Fiction</TabsTrigger>
                                <TabsTrigger onClick={() => setFilter("NON_FICTION")} value="NON_FICTION">Non Fiction</TabsTrigger>
                                <TabsTrigger onClick={() => setFilter("SCIENCE")} value="SCIENCE">Fiction</TabsTrigger>
                                <TabsTrigger onClick={() => setFilter("BIOGRAPHY")} value="BIOGRAPHY">Biography</TabsTrigger>
                                <TabsTrigger onClick={() => setFilter("FANTASY")} value="FANTASY">Fantasy</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        {/* For Adding a new book */}
                        <Dialog open={newDataForm} onOpenChange={setNewDataForm}>
                            <DialogTrigger asChild>
                                <Button className="text-[8px] md:text-[10px] lg:text-[12px] px-2 py-1 md:px-4 md:py-2">Add Books</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">

                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
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
                                    isLoadingforCreatig &&
                                    <div className="absolute top-1/2 left-1/2 -translate-1/2">
                                        <HashLoader />
                                    </div>
                                }
                            </DialogContent>
                        </Dialog>
                    
                    </div>
                </div>
                {/* Rendering Books */}
                <div className="mt-16 px-4 w-full flex items-center justify-center">
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-8 lg:gap-20">
                            {
                                bookData?.map((data) => <EachBook key={data._id} data={data} />)
                            }
                        </div>
                    </div>
                </div>
                {/* Handeling No Books */}
                {
                    bookData?.length === 0 &&
                    <div className="flex items-center justify-center my-20">
                        <h1 className="text-2xl text-gray-500/85">No Book Found!</h1>
                    </div>
                }
            </div>

        </div>
    );
};

export default Book;