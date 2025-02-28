/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import img1 from '../assets/banner/img1.webp';
import img2 from '../assets/banner/img1_mobile.jpg';
import img3 from '../assets/banner/img2.webp';
import img4 from '../assets/banner/img2_mobile.webp';
import img5 from '../assets/banner/img3_mobile.jpg';
import img6 from '../assets/banner/img3.jpg';
import img7 from '../assets/banner/img4.jpg';
import img8 from '../assets/banner/img4_mobile.jpg';
import img9 from '../assets/banner/img5.webp';
import img10 from '../assets/banner/img5_mobile.png';

// Custom arrow components
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-1.5 md:p-2 rounded-full shadow-lg hover:bg-white transition-colors group flex items-center justify-center cursor-pointer"
    aria-label="Previous slide"
  >
    <FaChevronLeft className="text-gray-600 text-base md:text-xl group-hover:text-gray-800" />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-1.5 md:p-2 rounded-full shadow-lg hover:bg-white transition-colors group flex items-center justify-center cursor-pointer"
    aria-label="Next slide"
  >
    <FaChevronRight className="text-gray-600 text-base md:text-xl group-hover:text-gray-800" />
  </button>
);

const Banner = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  
  const banners = [
    { desktop: img1, mobile: img2, alt: 'Banner 1' },
    { desktop: img3, mobile: img4, alt: 'Banner 2' },
    { desktop: img6, mobile: img5, alt: 'Banner 3' },
    { desktop: img7, mobile: img8, alt: 'Banner 4' },
    { desktop: img9, mobile: img10, alt: 'Banner 5' },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    pauseOnHover: true,
    dotsClass: 'slick-dots custom-dots',
    appendDots: (dots) => (
      <div className="absolute bottom-4 w-full">
        <ul className="flex justify-center gap-2"> {dots} </ul>
      </div>
    ),
    customPaging: (i) => (
      <button className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-black/50 hover:bg-black transition-all duration-300" />
    ),
  };

  return (
    <div className="container mx-auto px-4 mt-2">
      <div className="relative overflow-hidden rounded-lg shadow-lg">
        <Slider {...settings} className="banner-slider">
          {banners.map((banner, index) => (
            <div
              key={index}
              className="relative aspect-[16/7] md:aspect-[18/5]"
            >
              <img
                src={isMobile ? banner.mobile : banner.desktop}
                alt={banner.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />
            </div>
          ))}
        </Slider>
      </div>

      <style jsx="true">{`
        .banner-slider .slick-dots {
          bottom: 12px;
        }

        .banner-slider .slick-dots li button:before {
          display: none;
        }

        .banner-slider .slick-dots li {
          margin: 0 3px;
        }

        .banner-slider .slick-dots li.slick-active button {
          background-color: blue;
          transform: scale(1.2);
        }

        .banner-slider .slick-slide {
          transition: opacity 0.3s ease;
        }

        .banner-slider .slick-active {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .banner-slider .slick-dots {
            bottom: 8px;
          }

          .banner-slider .slick-dots li {
            margin: 0 2px;
          }

          .banner-slider .slick-dots li button {
            width: 6px;
            height: 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default Banner;
