import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../api/products';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Loading product...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
        <h2>Error: {error}</h2>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Product not found</h2>
      </div>
    );
  }

  const handleAddToCart = () => {
    // You'll implement cart later
    console.log('Added to cart:', { ...product, quantity });
    alert(`Added ${quantity} x ${product.name} to cart`);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Product Image */}
        <div>
          <img 
            src={product.image || 'https://via.placeholder.com/500'} 
            alt={product.name}
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </div>

        {/* Product Info */}
        <div>
          <h1>{product.name}</h1>
          
          {product.price && (
            <h2 style={{ color: '#2c7a4d', fontSize: '1.8rem' }}>
              ${product.price.toFixed(2)}
            </h2>
          )}

          {product.description && (
            <div style={{ margin: '1rem 0' }}>
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          )}

          {product.category && (
            <p><strong>Category:</strong> {product.category}</p>
          )}

          {product.stock !== undefined && (
            <p>
              <strong>Stock:</strong> 
              <span style={{ color: product.stock > 0 ? 'green' : 'red' }}>
                {product.stock > 0 ? ` ${product.stock} available` : ' Out of stock'}
              </span>
            </p>
          )}

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div style={{ margin: '1rem 0' }}>
              <label><strong>Quantity:</strong></label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
                >
                  -
                </button>
                <span style={{ fontSize: '1.2rem', minWidth: '3rem', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{
              background: product.stock > 0 ? '#2c7a4d' : '#ccc',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '4px',
              cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
              fontSize: '1rem',
              marginTop: '1rem'
            }}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;