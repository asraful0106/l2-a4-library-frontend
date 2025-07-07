import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useGetBookByIdQuery } from "@/redux/api/baseApi";
import { BadgeCheckIcon, CircleX } from "lucide-react";
import { useParams } from "react-router";
import { HashLoader } from "react-spinners";


const ViewABook = () => {
    const { id } = useParams();
    // console.log("Id: ", id)
    const { data: getData, isLoading, isError } = useGetBookByIdQuery(id);
    const data = getData?.data;
    console.log(data);
    return (
        <div>
            {
                isLoading &&
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
                !isLoading && !isError &&
                <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-6 min-w-screen min-h-screen  ml-10 md:ml-0 px-6">
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
};

export default ViewABook;