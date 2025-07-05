import MainLayout from "@/layout/MainLayout";
import Book from "@/pages/book/Book";
import {
    createBrowserRouter,
} from "react-router";


const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        children:[
            {
                path: "/",
                Component: Book
            },
            {
                path: "/books",
                Component: Book
            },
        ]
    },
]);

export default router;