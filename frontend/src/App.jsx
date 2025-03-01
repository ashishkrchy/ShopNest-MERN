/* eslint-disable react-hooks/exhaustive-deps */
import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import SummaryApi from './common/index';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';

function App() {
  const dispatch = useDispatch();

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const dataAPI = await response.json();

      if (dataAPI.success) {
        dispatch(setUserDetails(dataAPI.data));
      } else {
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      
    }
  };

  const [cartCount, setCartCount] = useState(0);

  const fetchUserAddToCartProductCount = async () => {
    try {
      const response = await fetch(SummaryApi.CountAddToCartProduct.url, {
        method: SummaryApi.CountAddToCartProduct.method,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const dataAPI = await response.json();

      setCartCount(dataAPI.data.count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(setUserDetails(JSON.parse(storedUser)));
      setCartCount(Number(cartCount));
    }
    fetchUserDetails();
    fetchUserAddToCartProductCount();
  }, []);

  return (
    <>
      <Context.Provider
        value={{ fetchUserDetails, cartCount, fetchUserAddToCartProductCount }}
      >
        <ToastContainer></ToastContainer>
        <Header />
        <main className="min-h-[calc(100vh-120px)] pt-15">
          <Outlet></Outlet>
        </main>
        <Footer></Footer>
      </Context.Provider>
    </>
  );
}

export default App;
