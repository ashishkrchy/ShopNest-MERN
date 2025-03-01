/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useContext } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { IoClose } from 'react-icons/io5';
import {
  FaRegUserCircle,
  FaShoppingCart,
  FaUser,
  FaHeart,
  FaSignOutAlt,
  FaCog,
  FaShoppingBasket,
} from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';
import debounce from 'lodash/debounce';
import appLogo from '../assets/appLOGO.png';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSearchExpanded, setIsSearchExpanded] = useState(false); // State for mobile search expansion
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const user = useSelector((state) => state.user.user);
  const { loading, error, fetchUserDetails, cartCount } = useContext(Context);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchInput(query);
    }
  }, [location.search]);

  const debouncedFetchSuggestions = debounce(async (query) => {
    if (!query.trim()) {
      setSearchSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `${SummaryApi.searchSuggestions.url}?q=${query}`
      );
      const data = await response.json();
      if (data.success) {
        setSearchSuggestions(data.suggestions.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }, 300);

  const handleSearchInputChange = (e) => {
    const { value } = e.target;
    setSearchInput(value);
    debouncedFetchSuggestions(value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
      setShowSuggestions(false);
      setIsSearchExpanded(false); // Close search on mobile after submission
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchInput(suggestion);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
    setIsSearchExpanded(false); // Close search on mobile after selection
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchSuggestions([]);
    setIsSearchExpanded(false); // Close search on mobile when cleared
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(SummaryApi.logout.url, {
        method: SummaryApi.logout.method,
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('User logged out successfully');
        dispatch(setUserDetails(null));
        navigate('/');
      } else {
        toast.error('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Something went wrong. Try again later.');
    } finally {
      setMenuDisplay(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuDisplay(false);
      }
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
        if (window.innerWidth <= 768) setIsSearchExpanded(false); // Close mobile search on outside click
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user && !loading) {
      fetchUserDetails();
    }
  }, [fetchUserDetails, user, loading]);

  return (
    <header
      className="h-16 bg-white fixed w-full z-40"
      style={{
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="h-full flex items-center justify-between px-4 lg:px-8">
        {/* ShopNest Logo */}
        <Link to={'/'} className="flex items-center gap-2">
          <img
            src={appLogo}
            width={50}
            height={30}
            className="bg-white rounded shadow-amber-300 shadow"
          />
          <h1 className="text-xl font-bold text-gray-800">ShopNest</h1>
        </Link>

        {/* Search Bar (Mobile and Desktop) */}
        <div
          className={`relative flex items-center flex-1 mx-4 max-w-2xl ${
            isSearchExpanded ? 'w-full' : ''
          }`}
          ref={searchRef}
        >
          {/* Mobile Search Toggle */}
          <button
            className="sm:hidden p-2 text-blue-600 hover:text-blue-500 transition-colors duration-200"
            onClick={() => {
              setIsSearchExpanded(!isSearchExpanded);
              setMenuDisplay(false); // Close user menu if open
            }}
            aria-label="Toggle Search Bar"
          >
            <IoSearchOutline size={26} />
          </button>

          {/* Mobile Expanded Search */}
          {isSearchExpanded && (
            <div className="absolute inset-0 bg-white flex items-center w-full z-10 p-2 shadow-md">
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex items-center w-full"
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full outline-none px-4 py-2 text-gray-800 bg-transparent placeholder-gray-400 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-600"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  onFocus={() => setShowSuggestions(true)}
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <IoClose size={20} />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-0 min-w-[44px] h-10 bg-blue-600 flex items-center justify-center rounded-full hover:bg-blue-700 transition-colors duration-200 cursor-pointer mr-1"
                >
                  <IoSearchOutline className="text-white" size={20} />
                </button>
              </form>
            </div>
          )}

          {/* Desktop Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex items-center w-full relative"
          >
            <div className="relative flex items-center w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full outline-none px-4 py-2.5 text-base bg-white placeholder-gray-400 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-600"
                value={searchInput}
                onChange={handleSearchInputChange}
                onFocus={() => setShowSuggestions(true)}
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-14 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <IoClose size={20} />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-0 min-w-[44px] h-10 bg-blue-600 flex items-center justify-center rounded-full hover:bg-blue-700 transition-colors duration-200 cursor-pointer mr-1"
              >
                <IoSearchOutline className="text-white" size={20} />
              </button>
            </div>

            {/* Search Suggestions */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden"
              >
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-200 flex items-center gap-2 cursor-pointer transition-colors duration-200"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <IoSearchOutline className="text-gray-400" />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Right Section (Hidden on Mobile Search Expansion) */}
        <div
          className={`flex items-center gap-6 ${
            isSearchExpanded && window.innerWidth <= 768 ? 'hidden' : ''
          }`}
        >
          {loading ? (
            <div className="bg-gray-200 h-8 w-16 rounded-full" />
          ) : error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : user ? (
            <>
              <h1 className="md:block hidden md:text-base md:font-semibold md:text-blue-600">
                {user.name}
              </h1>

              <div className="relative flex justify-center" ref={dropdownRef}>
                <button
                  className="text-3xl text-blue-600 hover:text-blue-500 transition-colors duration-200 cursor-pointer"
                  onClick={() => {
                    setMenuDisplay(!menuDisplay);
                    setIsSearchExpanded(false); // Close search if user menu is opened
                  }}
                >
                  <FaRegUserCircle />
                </button>
                {menuDisplay && (
                  <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg border border-gray-200 p-2 w-48 z-10">
                    <nav className="flex flex-col">
                      {user?.role === ROLE.ADMIN ? (
                        <>
                          <Link
                            to="/admin-panel/all-products"
                            className="flex items-center gap-2 px-3 py-2 text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
                            onClick={() => setMenuDisplay(false)}
                          >
                            <FaCog className="text-lg" />
                            Admin Panel
                          </Link>
                          <Link
                            to="/profile"
                            className="flex items-center gap-2 px-3 py-2 text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
                            onClick={() => setMenuDisplay(false)}
                          >
                            <FaUser className="text-lg cursor-pointer" />
                            Profile
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/profile"
                            className="flex items-center gap-2 px-3 py-2 text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
                            onClick={() => setMenuDisplay(false)}
                          >
                            <FaUser className="text-lg cursor-pointer" />
                            Profile
                          </Link>
                          <Link
                            to="/wishlist"
                            className="flex items-center gap-2 px-3 py-2 text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200"
                            onClick={() => setMenuDisplay(false)}
                          >
                            <FaHeart className="text-lg" />
                            Wishlist
                          </Link>
                        </>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setMenuDisplay(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-100 rounded-md transition-colors duration-200 w-full text-left cursor-pointer"
                      >
                        <FaSignOutAlt className="text-lg" />
                        Logout
                      </button>
                    </nav>
                  </div>
                )}
              </div>

              <Link
                to="/cart"
                className="relative text-2xl text-green-600 hover:text-green-500 transition-colors duration-200"
              >
                <FaShoppingCart />
                {cartCount > 0 && (
                  <div className="bg-blue-600 w-5 h-5 flex items-center justify-center rounded-full absolute -top-2 -right-2">
                    <p className="text-xs text-white font-medium">
                      {cartCount}
                    </p>
                  </div>
                )}
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 shadow-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
