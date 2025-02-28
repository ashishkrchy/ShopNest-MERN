/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { IoClose } from 'react-icons/io5';

const DisplayImage = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[rgba(226,232,240,0.7)]">
      <div className="relative bg-white shadow-lg rounded-lg p-6 max-w-[80vw] max-h-[80vh] flex flex-col items-center">
        {/* Close Button (Placed outside the image) */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:bg-gray-200 rounded-full p-2 transition cursor-pointer hover:text-red-600"
          onClick={onClose}
        >
          <IoClose size={22} />
        </button>

        {/* Image Container */}
        <div className="flex justify-center items-center p-4">
          <img
            src={imageUrl}
            alt="Image Preview"
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default DisplayImage;
