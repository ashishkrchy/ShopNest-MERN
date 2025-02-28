// src/helpers/cartLogic.js
import { useState, useEffect } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const useCartLogic = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.displayAddToCartProduct.url, {
        method: SummaryApi.displayAddToCartProduct.method,
        credentials: 'include',
      });
      const result = await response.json();

      if (result.success) {
        setCartItems(result.data.products || []);
      } else {
        throw new Error(result.message || 'Failed to fetch cart');
      }
    } catch (err) {
      setError(err.message);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      //setLoading(true);
      const response = await fetch(
        `${SummaryApi.updateAddToCartProduct.url}/${itemId}`,
        {
          method: SummaryApi.updateAddToCartProduct.method,
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );
      const result = await response.json();

      if (result.success) {
        setCartItems(
          cartItems.map((item) =>
            item._id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
        //toast.success('Quantity updated successfully!');
      } else {
        throw new Error(result.message || 'Failed to update quantity');
      }
    } catch (err) {
      setError(err.message);
      toast.error('Error updating quantity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      //setLoading(true);
      const response = await fetch(
        `${SummaryApi.deleteAddToCartProduct.url}/${itemId}`,
        {
          method: SummaryApi.deleteAddToCartProduct.method,
          credentials: 'include',
        }
      );
      const result = await response.json();

      if (result.success) {
        setCartItems(cartItems.filter((item) => item._id !== itemId));
        toast.success('Item removed from cart successfully!');
      } else {
        throw new Error(result.message || 'Failed to remove item');
      }
    } catch (err) {
      setError(err.message);
      toast.error('Error removing item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.productId.selling * item.quantity || 0),
      0
    );
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/checkout');
      toast.info('Proceeding to checkout...');
    } else {
      toast.error('Your cart is empty. Add items before checking out.');
    }
  };

  const subtotal = calculateSubtotal();
  const shipping = 50;

  const grandTotal = subtotal + shipping;

  return {
    cartItems,
    loading,
    error,
    handleQuantityChange,
    handleRemoveItem,
    handleCheckout,
    subtotal,
    shipping,
    grandTotal,
  };
};
