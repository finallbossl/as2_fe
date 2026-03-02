import { useEffect, useState } from 'react';
import { ShoppingCart, Heart, Search } from 'lucide-react';
import { useStore } from '../store/useStore';
import './Home.css';

const Home = () => {
  const { products, fetchProducts, addToCart } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        await fetchProducts();
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchProducts]);

  if (loading) return (
    <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
      <h1>Loading Elite Collection...</h1>
    </div>
  );

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>ELEGANCE IN <span>MOTION</span></h1>
          <p>Discover our curated collection of premium essentials designed for the modern trailblazer.</p>
          <button className="primary-btn hero-btn">Explore Collection</button>
        </div>
      </section>

      <div className="container product-section">
        <div className="section-header">
          <h2>Trending Now</h2>
          <div className="search-bar glass">
            <Search size={18} />
            <input type="text" placeholder="Search products..." />
          </div>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card glass">
              <div className="product-image">
                <img src={product.imageUrl} alt={product.name} />
                <button className="wishlist-btn"><Heart size={18} /></button>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-footer">
                  <span className="price">${product.price}</span>
                  <button 
                    onClick={() => addToCart(product)} 
                    className="add-btn"
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
