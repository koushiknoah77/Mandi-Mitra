import React, { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
        <span className="text-4xl">🌾</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group">
      <img 
        src={images[selectedIndex]} 
        alt={`${alt} - View ${selectedIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
      />
      
      {images.length > 1 && (
        <>
          {/* Controls */}
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 setSelectedIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
               }}
               className="bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
             </button>
             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 setSelectedIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
               }}
               className="bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
             </button>
          </div>

          {/* Indicators */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5">
            {images.map((_, idx) => (
              <div 
                key={idx}
                className={`w-1.5 h-1.5 rounded-full ${idx === selectedIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};