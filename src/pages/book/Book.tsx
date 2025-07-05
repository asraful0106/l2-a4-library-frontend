import RotatingText from "@/components/reactBits/RotatingText";
import BookCarousel from "./BookCarousel";

const Book = () => {
    return (
        <div>
            {/* Carousel Part */}
            <div className="mt-6 md:mt-10 relative rounded overflow-hidden">
                <BookCarousel/>
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
            
        </div>
    );
};

export default Book;