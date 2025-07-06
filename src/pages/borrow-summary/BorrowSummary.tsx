import { useGetBorrowSummaryQuery } from "@/redux/api/baseApi";
import { HashLoader } from "react-spinners";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { Isummarry } from "@/types/ISummary";

const BorrowSummary = () => {
    const { data, isError, isLoading } = useGetBorrowSummaryQuery(undefined);
    const borrowSummarys: Isummarry[] = data?.data;
    console.log("Borrow Summary", data);
    return (
        <div className="relative min-h-screen">

           {
            !isLoading && !isError && borrowSummarys.length> 0 &&
                <div className="md:min-w-screen md:min-h-screen flex items-center justify-center md:px-30 mt-10 md:mt-0">
                    <Table>
                        <TableCaption>A list of recent total borrows by each book.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Title</TableHead>
                                <TableHead>ISBN</TableHead>
                                <TableHead>Total Quantity</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {borrowSummarys?.map((borrowSummary: Isummarry) => (
                                <TableRow key={borrowSummary.book.isbn}>
                                    <TableCell className="font-medium">{borrowSummary?.book?.title}</TableCell>
                                    <TableCell>{borrowSummary?.book?.isbn}</TableCell>
                                    <TableCell>{borrowSummary?.totalQuantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
           }

            {/* Handeling the Error on fetching */}
            {
                isError &&
                <div className="absolute top-1/2 left-1/2 -translate-1/2">
                    <h1 className="text-2xl text-gray-400/80">Unable to load the data!</h1>
                </div>
            }
            {/* Handeling the Loading state */}
            {
                isLoading &&
                <div className="absolute top-1/2 left-1/2 -translate-1/2">
                    <HashLoader />
                </div>
            }
        </div>
    );
};

export default BorrowSummary;