import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SummaryApi from '../common';

const addToCart = async (e, id) => {
  e.stopPropagation();
  e.preventDefault();

  try {
    const response = await fetch(SummaryApi.addToCartProduct.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        productId: id,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || `Error ${response.status}`);
    }

    toast.success('Product added to cart successfully!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'light',
    });

    return responseData.data;
  } catch (error) {
    console.error('Error adding product to cart:', error);

    toast.error(
      error.message ||
        'An error occurred while adding the product to the cart.',
      {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      }
    );
  }
};

export default addToCart;
