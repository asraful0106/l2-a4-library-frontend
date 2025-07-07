import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateABookMutation } from "@/redux/api/baseApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";
import z from "zod";

const CreateNewBook = () => {
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

    // For creating new book
    const [createABook, { isLoading: isLoadingforCreatig }] = useCreateABookMutation();

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const res = await createABook(data);
        // console.log("Res: " ,res);
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
        }
    }
    return (
        <div className="min-w-screen min-h-screen flex items-center justify-center">
            <div className="shadow relative w-[70%] flex justify-center p-6">
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
                        <div className="flex items-center justify-center">
                            <Button type="submit">Submit</Button>
                        </div>
                    </form>
                </Form>
                {/* Spinner for data loading */}
                {
                    isLoadingforCreatig &&
                    <div className="absolute top-1/2 left-1/2 -translate-1/2">
                        <HashLoader />
                    </div>
                }
            </div>
        </div>
    );
};

export default CreateNewBook;