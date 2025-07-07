import MainLayout from "@/layout/MainLayout";
import Book from "@/pages/book/Book";
import BorrowBook from "@/pages/borrow-book/BorrowBook";
import BorrowSummary from "@/pages/borrow-summary/BorrowSummary";
import CreateNewBook from "@/pages/createBook/CreateNewBook";
import EditABook from "@/pages/Edit a Book/EditABook";
import ViewABook from "@/pages/view-a-book/ViewABook";
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
                path: "/books/:id",
                Component: ViewABook
            },
            {
                path: "/create-book",
                Component: CreateNewBook
            },
            {
                path: "/edit-book/:id",
                Component: EditABook

            },
            {
                path: "/borrow/:bookId",
                Component: BorrowBook
            },
            {
                path: "/borrow-summary",
                Component: BorrowSummary
            }
        ]
    },
]);

export default router;