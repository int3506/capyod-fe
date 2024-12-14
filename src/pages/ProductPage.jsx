import React from "react";
import Navbar from "../components/Navbar";
import PopularProducts from "../components/Catalog/PopularProducts";
import StarterEssentials from "../components/Catalog/StarterEssentials";
import HotNewProducts from "../components/Catalog/HotNewProducts";
import Header from "../components/Catalog/Header";
import { Outlet } from "react-router-dom";

const ProductPage = () => {
  return (
    <div>
      <Navbar />
      <Header />
      <div className="flex-1 bg-white p-6">
          <Outlet />
        </div>
      <PopularProducts />
      <StarterEssentials />
      <HotNewProducts />
    </div>
  );
};

export default ProductPage;
