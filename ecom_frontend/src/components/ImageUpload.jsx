import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ImageModal = ({ src, isOpen, onClose }) => {
  if (!isOpen || !src) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-[40%] h-[60%] aspect-square shadow-2xl overflow-hidden rounded-md bg-gray-900"
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-[110]"
        >
          <FaTimes className="w-6 h-6 cursor-pointer" /> 
        </button>

        <img 
          src={src} 
          alt="Profile Full View" 
          className="w-full h-full object-cover" 
        />
      </div>
    </div> 
  );
};

export default ImageModal;