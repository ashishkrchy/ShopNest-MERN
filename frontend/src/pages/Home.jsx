/* eslint-disable no-unused-vars */
import React from 'react';
import CategoryList from '../components/CategoryList';
import Banner from '../components/BannerProduct';
import HorizontalCardProduct from '../components/HoriZontalCardProduct';
import productCategory from '../helpers/productCategory.js';
import VerticalCardProduct from '../components/VerticalCardProduct.jsx';

const Home = () => {
  return (
    <div>
      <CategoryList />
      <Banner />
      {productCategory.map((category, index) => (
        <HorizontalCardProduct
          category={category.value}
          heading={category.heading}
          key={index}
        />
      ))}
      {productCategory.map((category, index) => (
        <VerticalCardProduct
          category={category.value}
          heading={category.heading}
          key={index}
        />
      ))}
    </div>
  );
};

export default Home;
