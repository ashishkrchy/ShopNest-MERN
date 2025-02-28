/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useCallback } from 'react';
import { IoClose } from 'react-icons/io5';
import productCategory from '../helpers/productCategory.js';
import { FaCloudUploadAlt } from 'react-icons/fa';
import uploadImage from '../helpers/uploadImage.js';
import DisplayImage from './DisplayImage.jsx';
import { MdDelete } from 'react-icons/md';
import SummaryApi from '../common/index.js';
import { toast } from 'react-toastify';

// Custom CSS Animations
const styles = `
  @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulseSlow { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
  @keyframes bounceIn { from { opacity: 0; transform: scale(0.8); } 50% { transform: scale(1.1); } to { opacity: 1; transform: scale(1); } }

  .animate-fade-in { animation: fadeIn 0.8s ease-out; }
  .animate-slide-up { animation: slideUp 0.8s ease-out; }
  .animate-pulse-slow { animation: pulseSlow 2s infinite; }
  .animate-bounce-in { animation: bounceIn 0.8s ease-out; }

  .group:hover .group-hover\\:block {
    display: block !important;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

const UploadProduct = ({ onClose, fetchAllProduct }) => {
  const [data, setData] = useState({
    productName: '',
    brandName: '',
    category: '',
    productImage: [],
    productDescription: '',
    productPrice: '',
    selling: '',
  });

  const [fullScreenImage, setFullScreenImage] = useState('');
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);

  const handleOnChange = useCallback((e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleUploadProduct = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (data.productImage.includes(file.name)) {
        toast.warning('This image is already uploaded.');
        return;
      }

      try {
        const uploadImageCloudinary = await uploadImage(file);
        setData((prev) => ({
          ...prev,
          productImage: [...prev.productImage, uploadImageCloudinary.url],
        }));
        toast.success('Image uploaded successfully!');
      } catch (error) {
        toast.error('Failed to upload image.');
      }
    },
    [data.productImage]
  );

  const handleDeleteProductImage = useCallback((e, index) => {
    e.preventDefault();
    setData((prev) => ({
      ...prev,
      productImage: prev.productImage.filter((_, i) => i !== index),
    }));
    toast.info('Image removed successfully.');
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      console.log('Product Data Submitted:', data);

      try {
        const response = await fetch(SummaryApi.uploadProduct.url, {
          method: SummaryApi.uploadProduct.method,
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(data),
        });

        const dataResponse = await response.json();

        if (dataResponse.success) {
          toast.success('Product uploaded successfully!');
          fetchAllProduct();
          setData({
            productName: '',
            brandName: '',
            category: '',
            productImage: [],
            productDescription: '',
            productPrice: '',
            selling: '',
          });
          onClose();
        } else {
          toast.error(dataResponse.message || 'Failed to upload product.');
        }
      } catch (error) {
        toast.error('Something went wrong. Please try again.');
      }
    },
    [data, onClose, fetchAllProduct]
  );

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.7)] mt-10">
      <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-700 relative max-h-[90%]">
        <div className="flex justify-between items-center mb-5 border-b border-gray-700 pb-4">
          <h2 className="text-xl font-semibold text-white">Upload Product</h2>
          <button
            className="text-gray-300 hover:bg-gray-700 rounded-full p-2 transition cursor-pointer shadow-sm hover:shadow-md"
            onClick={onClose}
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto pr-3 scrollbar-hide">
          <form onSubmit={handleSubmit} className="space-y-6 px-5">
            <div>
              <label className="block text-gray-300 font-medium mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                placeholder="Enter product name"
                value={data.productName}
                onChange={handleOnChange}
                className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition shadow-sm text-white bg-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1">
                Brand Name
              </label>
              <input
                type="text"
                name="brandName"
                placeholder="Enter brand name"
                value={data.brandName}
                onChange={handleOnChange}
                className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition shadow-sm text-white bg-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1">
                Category
              </label>
              <select
                name="category"
                value={data.category}
                onChange={handleOnChange}
                className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition shadow-sm text-gray-300 bg-gray-800"
                required
              >
                <option value="" className="bg-gray-900 text-gray-300">
                  Select a category
                </option>
                {productCategory.map((ele, index) => (
                  <option
                    value={ele.value}
                    key={index}
                    className="bg-gray-900 text-white"
                  >
                    {ele.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1">
                Product Image
              </label>
              <label htmlFor="uploadImageInput">
                <div className="p-4 bg-gray-800 border border-dashed border-gray-600 rounded-lg h-32 w-full flex justify-center items-center cursor-pointer hover:bg-gray-700 transition shadow-sm">
                  <div className="text-gray-400 flex justify-center items-center flex-col gap-2">
                    <span className="text-3xl">
                      <FaCloudUploadAlt />
                    </span>
                    <p className="text-sm font-medium">Upload Product Image</p>
                    <input
                      type="file"
                      id="uploadImageInput"
                      className="hidden"
                      onChange={handleUploadProduct}
                    />
                  </div>
                </div>
              </label>

              {data?.productImage.length > 0 && (
                <div className="flex gap-3 mt-3 mb-3 flex-wrap">
                  {data.productImage.map((image, index) => (
                    <div key={index} className="relative w-24 h-24 group">
                      <button
                        className="absolute top-1 right-1 bg-gray-900 text-gray-100 hover:bg-red-600 rounded-full p-1.5 transition cursor-pointer group-hover:block hidden shadow-md hover:shadow-lg"
                        onClick={(e) => handleDeleteProductImage(e, index)}
                      >
                        <MdDelete size={18} />
                      </button>
                      <img
                        src={image}
                        alt="Product"
                        width={96}
                        height={96}
                        className="w-full h-full bg-gray-100 rounded-lg object-cover cursor-pointer hover:shadow-md transition "
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenFullScreenImage(true);
                          setFullScreenImage(image);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Description */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Product Description
              </label>
              <textarea
                name="productDescription"
                value={data.productDescription}
                onChange={handleOnChange}
                className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition shadow-sm text-white bg-gray-800"
                rows="4"
                placeholder="Enter product description..."
                required
              ></textarea>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-gray-300 font-medium mb-2">
                  Product Price
                </label>
                <input
                  type="number"
                  name="productPrice"
                  placeholder="Enter product actual price"
                  value={data.productPrice}
                  onChange={handleOnChange}
                  className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition shadow-sm text-white bg-gray-800"
                  required
                />
              </div>

              <div className="w-1/2">
                <label className="block text-gray-300 font-medium mb-2">
                  Selling Price
                </label>
                <input
                  type="number"
                  placeholder="Enter product selling price"
                  name="selling"
                  value={data.selling}
                  onChange={handleOnChange}
                  className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition shadow-sm text-white bg-gray-800"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full max-w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Upload Product
            </button>
          </form>
        </div>
      </div>

      {openFullScreenImage && (
        <DisplayImage
          imageUrl={fullScreenImage}
          onClose={() => setOpenFullScreenImage(false)}
        />
      )}
    </div>
  );
};

export default UploadProduct;
