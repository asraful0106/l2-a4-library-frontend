import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
// import { Card, CardContent } from "@/components/ui/card";

const BookCarousel = () => {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    )
    const imageLink: string[] = [
        "/images/book-r-1.jpg",
        "/images/book-r-2.jpg",
        "/images/book-r-3.jpg",
        "/images/book-r-4.jpg"
    ]
    return (
        <div className="w-full h-[15rem] lg:h-[40rem] flex items-center justify-center rounded overflow-hidden">
            <Carousel
                opts={{ loop: true }}
                plugins={[plugin.current]}
                className="w-full max-w-[80%] h-full rounded"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
            >
                <CarouselContent className="h-full rounded">
                    {imageLink.map((img, index) => (
                        <CarouselItem key={index} className="h-full flex items-center justify-center rounded">
                            <div className="p-1 h-full w-full">
                                <img src={img} alt="" className="w-full h-full object-cover rounded blur-[2px]" />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="hidden md:block">
                    <CarouselPrevious />
                    <CarouselNext />
                </div>
            </Carousel>

        </div>
    );
};

export default BookCarousel;