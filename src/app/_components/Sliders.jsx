import React from 'react'
import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

function SliderList({ sliderList }) {
  // Debug what we're receiving
  console.log("SliderList received:", sliderList);

  // Handle cases where sliderList might be undefined or null
  if (!sliderList) {
    return (
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">Loading sliders...</p>
      </div>
    );
  }

  // Ensure we're working with an array
  const slidersArray = Array.isArray(sliderList) ? sliderList : [];

  if (slidersArray.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">No sliders available</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <Carousel className="w-full">
        <CarouselContent>
          {slidersArray.map((slider, index) => {
            // Access the image data correctly based on your API structure
            const firstImage = slider.image?.[0];
            const imageUrl = firstImage?.url || firstImage?.formats?.large?.url || firstImage?.formats?.medium?.url;

            if (!imageUrl) {
              console.warn('No image URL found for slider:', slider);
              return null;
            }

            // Construct the full image URL
            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:1337';
            const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;

            console.log(`Slider ${index} image URL:`, fullImageUrl);

            return (
              <CarouselItem key={slider.id || slider.documentId || `slider-${index}`}>
                <div className="relative w-full h-64 md:h-96 lg:h-[400px] mt-6 p-5 md:p-10 px-16">
                  <Image 
                    src={fullImageUrl}
                    fill
                    alt={slider.name || `Slider ${index + 1}`}
                    className="object-cover rounded-2xl "
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
}

export default SliderList;