/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UploadProduct from '../components/UploadProduct';
import SummaryApi from '../common/index';
import AdminProductCard from '../components/AdminProductCard';
import EditProductModal from '../components/EditProductModal';

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAllProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.getAllProduct.url, {
        method: SummaryApi.getAllProduct.method,
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success) {
        setAllProduct(data.data || []);
      } else {
        toast.error(
          'Error fetching products: ' + (data.message || 'Unknown error')
        );
      }
    } catch (error) {
      toast.error('Fetch Error: ' + (error.message || 'Something went wrong'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllProduct();
  }, [fetchAllProduct]);

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleSave = async (updatedProduct) => {
    try {
      const response = await fetch(
        `${SummaryApi.updateProduct.url}/${updatedProduct._id}`,
        {
          method: SummaryApi.updateProduct.method,
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(updatedProduct),
        }
      );

      const data = await response.json();
      if (data.success) {
        setAllProduct((prevProducts) =>
          prevProducts.map((p) =>
            p._id === updatedProduct._id ? updatedProduct : p
          )
        );
        setEditingProduct(null);
        toast.success('Product updated successfully!');
      } else {
        toast.error(
          'Failed to update product: ' + (data.message || 'Unknown error')
        );
      }
    } catch (error) {
      toast.error(
        'Error updating product: ' + (error.message || 'Something went wrong')
      );
    }
  };

  // Handle Delete Product
  const handleDelete = async (productId) => {
    try {
      const response = await fetch(
        `${SummaryApi.deleteProduct.url}/${productId}`,
        {
          method: SummaryApi.deleteProduct.method,
          credentials: 'include',
        }
      );

      const data = await response.json();
      if (data.success) {
        setAllProduct((prevProducts) =>
          prevProducts.filter((p) => p._id !== productId)
        );
        toast.success('Product deleted successfully!');
      } else {
        toast.error(
          'Failed to delete product: ' + (data.message || 'Unknown error')
        );
      }
    } catch (error) {
      toast.error(
        'Error deleting product: ' + (error.message || 'Something went wrong')
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-120px)] bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center shadow-md border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800">All Products</h1>
        <button
          className="border-2 border-blue-600 bg-white hover:bg-blue-600 hover:text-white py-2 px-4 rounded-lg font-medium transition-colors cursor-pointer shadow-sm hover:shadow-md"
          onClick={() => setOpenUploadProduct(true)}
        >
          Upload Product
        </button>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 max-h-[calc(100vh-100px)] overflow-y-auto">
        <div className="flex flex-wrap gap-3">
          {allProduct.length > 0 ? (
            allProduct.map((product) => (
              <AdminProductCard
                product={product}
                key={product._id}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center w-full py-6">
              No products found.
            </p>
          )}
        </div>
      </div>

      {/* Upload Product Component */}
      {openUploadProduct && (
        <UploadProduct
          onClose={() => setOpenUploadProduct(false)}
          fetchAllProduct={fetchAllProduct}
        />
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default AllProducts;
