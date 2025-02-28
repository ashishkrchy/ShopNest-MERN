/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import uploadImage from '../helpers/uploadImage.js';
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

const EditProductModal = ({ product, onClose, onSave }) => {
  const [editedProduct, setEditedProduct] = useState({ ...product });
  const [errors, setErrors] = useState({});
  const [fullScreenImage, setFullScreenImage] = useState('');
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);

  useEffect(() => {
    setEditedProduct({ ...product });
  }, [product]);

  const handleChange = useCallback(
    (e) => {
      const { name, value, type } = e.target;
      setEditedProduct((prev) => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value,
      }));

      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    },
    [errors]
  );

  const handleUploadProductImage = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (editedProduct.productImage?.includes(file.name)) {
        toast.warning('This image is already uploaded.');
        return;
      }

      try {
        const uploadImageCloudinary = await uploadImage(file);
        setEditedProduct((prev) => ({
          ...prev,
          productImage: [
            ...(prev.productImage || []),
            uploadImageCloudinary.url,
          ],
        }));
        toast.success('Image uploaded successfully!');
      } catch (error) {
        toast.error('Failed to upload image.');
      }
    },
    [editedProduct.productImage]
  );

  const handleDeleteProductImage = useCallback((id, e) => {
    e.preventDefault();
    setEditedProduct((prev) => ({
      ...prev,
      productImage: (prev.productImage || []).filter(
        (_, index) => index !== id
      ),
    }));
    toast.info('Image removed successfully.');
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!editedProduct.productName?.trim()) {
      newErrors.productName = 'Product name is required';
    }
    if (!editedProduct.brandName?.trim()) {
      newErrors.brandName = 'Brand name is required';
    }
    if (!editedProduct.productPrice || editedProduct.productPrice <= 0) {
      newErrors.productPrice = 'Valid product price is required';
    }
    if (!editedProduct.selling || editedProduct.selling <= 0) {
      newErrors.selling = 'Valid selling price is required';
    }
    if (editedProduct.selling > editedProduct.productPrice) {
      newErrors.selling = 'Selling price cannot be higher than product price';
    }
    if (!editedProduct.category?.trim()) {
      newErrors.category = 'Category is required';
    }
    if (!editedProduct.productDescription?.trim()) {
      newErrors.productDescription = 'Description is required';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave(editedProduct);
    console.log(editedProduct);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.7)] z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Edit Product</h2>
            <button
              onClick={onClose}
              className="text-gray-300 hover:bg-gray-700 rounded-full p-2 transition cursor-pointer shadow-sm hover:shadow-md"
            >
              <IoClose size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-200">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  value={editedProduct.productName || ''}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-lg border ${
                    errors.productName ? 'border-red-500' : 'border-gray-600'
                  } p-3 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 transition bg-gray-800 text-white`}
                />
                {errors.productName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.productName}
                  </p>
                )}
              </div>

              {/* Brand Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Brand Name
                </label>
                <input
                  type="text"
                  name="brandName"
                  value={editedProduct.brandName || ''}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-lg border ${
                    errors.brandName ? 'border-red-500' : 'border-gray-600'
                  } p-3 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 transition bg-gray-800 text-white`}
                />
                {errors.brandName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.brandName}
                  </p>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={editedProduct.category || ''}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border ${
                  errors.category ? 'border-red-500' : 'border-gray-600'
                } p-3 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 transition bg-gray-800 text-white`}
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">{errors.category}</p>
              )}
            </div>

            {/* Product Image */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
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
                      onChange={handleUploadProductImage}
                    />
                  </div>
                </div>
              </label>

              {editedProduct?.productImage?.length > 0 && (
                <div className="flex gap-3 mt-3 mb-3 flex-wrap">
                  {editedProduct.productImage.map((image, id) => (
                    <div key={id} className="relative w-24 h-24 group">
                      <button
                        className="absolute top-1 right-1 bg-gray-900 text-gray-100 hover:bg-red-600 rounded-full p-1.5 transition cursor-pointer group-hover:block hidden shadow-md hover:shadow-lg"
                        onClick={(e) => handleDeleteProductImage(id, e)}
                      >
                        <MdDelete size={18} />
                      </button>
                      <img
                        src={image}
                        alt="Product"
                        width={96}
                        height={96}
                        className="w-full h-full bg-gray-100 cursor-pointer rounded-lg object-contain hover:shadow-md transition"
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
              <label className="block text-sm font-medium text-gray-300">
                Product Description
              </label>
              <textarea
                name="productDescription"
                value={editedProduct.productDescription || ''}
                onChange={handleChange}
                rows={4}
                className={`mt-1 block w-full rounded-lg border ${
                  errors.productDescription
                    ? 'border-red-500'
                    : 'border-gray-600'
                } p-3 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 transition bg-gray-800 text-white`}
              />
              {errors.productDescription && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.productDescription}
                </p>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-200">Pricing</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Price */}
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Original Price (₹)
                </label>
                <input
                  type="number"
                  name="productPrice"
                  value={editedProduct.productPrice || ''}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`mt-1 block w-full rounded-lg border ${
                    errors.productPrice ? 'border-red-500' : 'border-gray-600'
                  } p-3 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 transition bg-gray-800 text-white`}
                />
                {errors.productPrice && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.productPrice}
                  </p>
                )}
              </div>

              {/* Selling Price */}
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Selling Price (₹)
                </label>
                <input
                  type="number"
                  name="selling"
                  value={editedProduct.selling || ''}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`mt-1 block w-full rounded-lg border ${
                    errors.selling ? 'border-red-500' : 'border-gray-600'
                  } p-3 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 transition bg-gray-800 text-white`}
                />
                {errors.selling && (
                  <p className="mt-1 text-sm text-red-500">{errors.selling}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 bg-gray-900 pt-5 border-t border-gray-700 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-600 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-lg shadow-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {openFullScreenImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.9)] z-50">
          <div className="relative">
            <img
              src={fullScreenImage}
              alt="Full Screen Product"
              className="max-w-full max-h-[90vh] rounded-lg"
            />
            <button
              onClick={() => setOpenFullScreenImage(false)}
              className="absolute top-4 right-4 text-white bg-red-600 rounded-full p-2 hover:bg-red-700 transition cursor-pointer"
            >
              <IoClose size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProductModal;
