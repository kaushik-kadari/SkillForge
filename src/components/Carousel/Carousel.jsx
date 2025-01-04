import React, { useState, useEffect } from 'react';
import Content from '../Content/Content';
import GenerateContent from '../GenerateContent/GenerateContent';
import Progress from '../Progress/Progress';
import Topic from '../Topic/Topic';

const Carousel = ({ progress }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // To control the initial load animation

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false); // After the page loads, stop the loading effect
    }, 300); // You can adjust the delay

    return () => clearTimeout(timeoutId);
  }, []);

  // Function for the previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? progress.length - 1 : prev - 1));
  };

  // Function for the next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === progress.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full max-w-lg mx-auto overflow-hidden">
      <div
        className={`flex transition-transform duration-1000 ease-in-out ${isLoading ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {progress.map((item, index) => (
          <div key={index} className="min-w-full flex justify-center items-center p-4">
            <div className="text-center">
              <div
                className="radial-progress bg-[#e4e2e2] text-primary-content border-[#e4e2e2] border-4 mx-auto"
                style={{ "--value": item.value }}
                role="progressbar"
              >
                {item.value}%
              </div>
              <p className="text-xl mt-4">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
        onClick={prevSlide}
      >
        &#8249;
      </button>

      {/* Right Arrow */}
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
        onClick={nextSlide}
      >
        &#8250;
      </button>
    </div>
  );
};

export default Carousel;