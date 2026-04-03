import { useEffect, useState } from "react";
import CollectionCard from "./CollectionCard"; // adjust path

function Shop({ addToCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/products`
        );
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="products-grid">
      {products.map((product, index) => (
        <CollectionCard
          key={product._id}
          product={product}
          index={index}
          addToCart={addToCart}
        />
      ))}
    </div>
  );
}

export default Shop;
