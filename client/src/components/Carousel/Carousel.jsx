import React, { useState, useEffect } from "react";

const Carousel = ({ progress }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? progress.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === progress.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto overflow-hidden px-10 sm:px-12">
      <div
        className={`flex transition-transform duration-1000 ease-in-out ${
          isLoading ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"
        }`}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {progress.map((item, index) => (
          <div
            key={index}
            className="min-w-full flex justify-center items-center py-2"
          >
            <div className="text-center min-w-0">
              <div
                className="radial-progress bg-[#e4e2e2] text-primary-content border-[#e4e2e2] border-4 mx-auto"
                style={{ "--value": item.value, "--size": "5.5rem" }}
                role="progressbar"
              >
                {item.value}%
              </div>
              <p className="text-base sm:text-lg mt-3 leading-snug px-2">
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="absolute top-1/2 left-1 sm:left-2 -translate-y-1/2 bg-gray-800 text-white w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-lg leading-none shrink-0"
        onClick={prevSlide}
        aria-label="Previous progress"
      >
        ‹
      </button>

      <button
        type="button"
        className="absolute top-1/2 right-1 sm:right-2 -translate-y-1/2 bg-gray-800 text-white w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-lg leading-none shrink-0"
        onClick={nextSlide}
        aria-label="Next progress"
      >
        ›
      </button>

      <div className="flex justify-center gap-1.5 mt-2 pb-1">
        {progress.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to ${progress[index].label}`}
            onClick={() => setCurrentSlide(index)}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              index === currentSlide ? "bg-gray-800" : "bg-gray-400/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
