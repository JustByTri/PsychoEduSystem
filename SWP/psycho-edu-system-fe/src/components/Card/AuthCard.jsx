import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AuthCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    {
      url: '/a1.jpg',
      alt: 'FPT Edu Students Working Together'
    },
    {
      url: '/a2.jpg',
      alt: 'Students at Cultural Event'
    },
    {
      url: '/a3.jpg',
      alt: 'Students Having Fun'
    },
    // Add more images as needed
    {
      url: '/a3.jpg',
      alt: 'Students in Classroom'
    },
    {
      url: '/a2.jpg',
      alt: 'Campus Life'
    },
    {
      url: '/a1.jpg',
      alt: 'Student Activities'
    },
    {
      url: '/a1.jpg',
      alt: 'FPT Edu Students Working Together'
    },
    {
      url: '/a2.jpg',
      alt: 'Students at Cultural Event'
    },
    {
      url: '/a3.jpg',
      alt: 'Students Having Fun'
    }
  ];

  const totalGroups = Math.ceil(images.length / 3);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - 3;
      return newIndex < 0 ? 0 : newIndex;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 3;
      return newIndex >= images.length - 2 ? images.length - 3 : newIndex;
    });
  };

  const goToGroup = (groupIndex) => {
    setCurrentIndex(groupIndex * 3);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto mt-6">
      <div className="flex items-center justify-center gap-4 w-full">
        {/* Left Arrow */}
        <button 
          onClick={goToPrevious}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Image Container */}
        <div className="relative flex-1 overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * (100/3)}%)` }}
          >
            {images.map((image, index) => (
              <div 
                key={index} 
                className="w-1/3 flex-shrink-0 px-2"
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button 
          onClick={goToNext}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          disabled={currentIndex >= images.length - 3}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {[...Array(totalGroups)].map((_, index) => (
          <button
            key={index}
            onClick={() => goToGroup(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              Math.floor(currentIndex / 3) === index 
                ? 'bg-gray-800' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide group ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AuthCard;
