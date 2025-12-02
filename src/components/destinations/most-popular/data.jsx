"use client";
import { useEffect, useState, useRef, use } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export function Data({ query }) {
   const { data = [] } = query;

   const [currentIndex, setCurrentIndex] = useState(0);
   const [isAnimating, setIsAnimating] = useState(false);
   const [direction, setDirection] = useState("next"); // 'next' or 'prev'
   const intervalRef = useRef(null);

   // Auto-play dengan interval 4 detik
   useEffect(() => {
      if (data.length > 0) {
         intervalRef.current = setInterval(() => {
            handleNext();
         }, 8000);
      }

      return () => {
         if (intervalRef.current) clearInterval(intervalRef.current);
      };
   }, [data.length, currentIndex]);

   const handleNext = () => {
      if (isAnimating) return;

      setIsAnimating(true);
      setDirection("next");

      setTimeout(() => {
         setCurrentIndex((prev) => (prev + 1) % data.length);
         setIsAnimating(false);
      }, 500);
   };

   const handlePrev = () => {
      if (isAnimating) return;

      setIsAnimating(true);
      setDirection("prev");

      setTimeout(() => {
         setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
         setIsAnimating(false);
      }, 500);
   };

   const goToSlide = (index) => {
      if (isAnimating || index === currentIndex) return;

      setIsAnimating(true);
      setDirection(index > currentIndex ? "next" : "prev");

      setTimeout(() => {
         setCurrentIndex(index);
         setIsAnimating(false);
      }, 500);
   };

   const resetInterval = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
   };

   const goToPrev = () => {
      resetInterval();
      handlePrev();
   };

   const goToNext = () => {
      resetInterval();
      handleNext();
   };

   if (!data || data.length === 0) {
      return (
         <div className="text-center py-8 text-gray-500">
            No destinations found
         </div>
      );
   }

   const currentItem = data[currentIndex];

   return (
      <div className="w-full h-full max-w-7xl mx-auto">
         <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
            {/* Single Slide Container dengan Animasi */}
            <div className="relative aspect-video md:h-dvh w-full overflow-hidden">
               {currentItem?.images?.[0]?.imageUrl ? (
                  <>
                     <div className="relative w-full h-full">
                        <img
                           src={currentItem.images[0].imageUrl}
                           alt={currentItem.nama || "Destination"}
                           className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out ${
                              isAnimating
                                 ? direction === "next"
                                    ? "opacity-0 translate-x-100"
                                    : "opacity-0 -translate-x-100"
                                 : "opacity-100 translate-x-0"
                           }`}
                           loading="lazy"
                           onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                 "https://via.placeholder.com/800x450?text=No+Image";
                           }}
                        />
                        <div
                           className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-1000 ${
                              isAnimating ? "opacity-0" : "opacity-100"
                           }`}
                        />
                        <div
                           className={`absolute bottom-10 left-0 right-0 max-w-6xl w-full mx-auto p-6 text-white transition-all duration-1000 transform ${
                              isAnimating
                                 ? direction === "next"
                                    ? "translate-y-100 opacity-0"
                                    : "translate-y-100 opacity-0"
                                 : "translate-y-0 opacity-100"
                           }`}
                        >
                           <h3 className="text-2xl md:text-3xl font-bold mb-2 line-clamp-1">
                              {currentItem.nama}
                           </h3>
                           <p className="text-gray-200 text-xs line-clamp-2 mb-4">
                              {currentItem.deskripsi?.substring(0, 150)}...
                           </p>
                           <Link
                              href={`/destinasi/${currentItem.id}/preview`}
                              className="px-4 py-2 bg-primary/70 text-white text-sm rounded-full font-semibold hover:bg-primary/70 transition-colors transform hover:scale-105 duration-200"
                           >
                              Read More
                           </Link>
                        </div>
                     </div>
                  </>
               ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                     <span className="text-gray-400">No image available</span>
                  </div>
               )}
            </div>

            {/* Navigation Buttons dengan Animasi */}
            <button
               onClick={goToPrev}
               className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-1000 transform hover:scale-110 active:scale-95"
               aria-label="Previous slide"
            >
               <ChevronLeft size={24} />
            </button>

            <button
               onClick={goToNext}
               className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-1000 transform hover:scale-110 active:scale-95"
               aria-label="Next slide"
            >
               <ChevronRight size={24} />
            </button>

            {/* Dots Indicator dengan Animasi */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
               {data.map((_, index) => (
                  <button
                     key={index}
                     onClick={() => {
                        resetInterval();
                        goToSlide(index);
                     }}
                     className={`transition-all duration-1000 ${
                        index === currentIndex
                           ? "w-6 bg-white"
                           : "w-3 bg-white/50 hover:bg-white/70"
                     } h-3 rounded-full`}
                     aria-label={`Go to slide ${index + 1}`}
                  />
               ))}
            </div>
         </div>
      </div>
   );
}
