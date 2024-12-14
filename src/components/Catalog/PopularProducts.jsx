import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PopularProducts.css';
import tshirts from '../../assets/catalog/tshirts.png';
import sweatshirts from '../../assets/catalog/sweatshirts.png';
import hoodies from '../../assets/catalog/hoodies.png';
import blankets from '../../assets/catalog/blankets.png';
import babycloth from '../../assets/catalog/babycloth.png';
import supplements from '../../assets/catalog/supplements.png';

const products = [
  { name: "T-shirts", image: tshirts, link: "./shirt" },
  { name: "Sweatshirts", image: sweatshirts, link: "./sweatshirt" },
  { name: "Hoodies", image: hoodies, link: "./hoodie" },
  { name: "Blankets", image: blankets, link: "./Blankets" },
  { name: "Baby Clothing", image: babycloth, link: "./Baby-Clothing" },
  { name: "Supplements", image: supplements, link: "./Supplements", badge: "New!" },
];

const PopularProducts = () => {
  const navigate = useNavigate();

  return (
    <section className="popular-products">
      <div className="container">
        <h2>Explore Printify's best</h2>
        <p className="description">
          Here are some of the most popular product categories in our catalog.
        </p>
        <div className="product-list">
          {products.map((product) => (
            <div
              key={product.name}
              className="product-item"
              onClick={() => navigate(product.link)}
            >
              <img src={product.image} alt={product.name} />
              <p className="product-name">{product.name}</p>
              {product.badge && <span className="badge new">{product.badge}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;
