"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";

interface ImageCarouselProps {
  images: string;
}

export const ZoomableImage = ({ images }: ImageCarouselProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  const openPreview = (index: number) => {
    setSelectedIndex(index);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!api) return;
    api.scrollTo(selectedIndex);
  }, [api, selectedIndex, isOpen]);

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {images?.split(",")?.map((image, index) => (
          <button
            key={image}
            className="relative h-20 w-auto  rounded-base overflow-hidden group"
            onClick={() => openPreview(index)}
          >
            <Image
              src={image}
              alt={image}
              width={1200}
              height={800}
              className="object-cover transition-transform group-hover:scale-110"
            />
          </button>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-none max-h-screen sm:max-w-none p-0 bg-transparent border-0">
          <div className="relative w-screen h-screen flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Carousel setApi={setApi} className="w-full max-w-5xl">
              <CarouselContent>
                {images?.split(",")?.map((image) => (
                  <CarouselItem key={image}>
                    <div className="flex items-center justify-center p-6">
                      <Image
                        src={image}
                        alt={image}
                        width={1200}
                        height={800}
                        className="max-h-screen w-auto object-contain rounded-base"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
