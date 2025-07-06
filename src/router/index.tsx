import MainLayout from "@/layout/MainLayout";
import Book from "@/pages/book/Book";
import BorrowSummary from "@/pages/borrow-summary/BorrowSummary";
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
            {
                path: "/borrow-summary",
                Component: BorrowSummary
            }
        ]
    },
]);

export default router;