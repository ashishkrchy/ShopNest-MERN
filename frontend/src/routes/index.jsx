import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import SignUp from '../pages/SignUp';
import AdminPanel from '../pages/AdminPanel';
import AllUsers from '../pages/AllUsers';
import AllProducts from '../pages/AllProducts';
import CategoryProduct from '../pages/CategoryProduct';
import ProductDetail from '../components/ProductDetail';
import Profile from '../components/Profile';
import Cart from '../components/Cart';
import SearchProduct from '../pages/SearchProduct';
import AdminOrders from '../components/AdminOrders';
import AdminAnalytics from '../components/AdminAnalytics';
import UserOrders from '../components/UserOrders';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'sign-up',
        element: <SignUp />,
      },
      {
        path: 'category-product/:category',
        element: <CategoryProduct />,
      },
      {
        path: 'product/:productId',
        element: <ProductDetail />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'search',
        element: <SearchProduct />,
      },
      {
        path: 'orders',
        element: <UserOrders />,
      },
      {
        path: 'admin-panel',
        element: <AdminPanel />,
        children: [
          {
            path: 'all-users',
            element: <AllUsers />,
          },
          {
            path: 'all-products',
            element: <AllProducts />,
          },
          {
            path: 'orders',
            element: <AdminOrders />,
          },
          {
            path: 'analytics',
            element: <AdminAnalytics />,
          },
        ],
      },
    ],
  },
]);

export default router;
