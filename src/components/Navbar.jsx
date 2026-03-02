import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, PlusCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import './Navbar.css';

const Navbar = () => {
  const { user, cart, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar glass">
      <div className="container nav-content">
        <Link to="/" className="logo">
          ELITE<span>CLOTHIER</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Shop</Link>
          {user && (
            <Link to="/orders" className="nav-icon-link">
              <Package size={20} />
              <span>Orders</span>
            </Link>
          )}
        </div>

        <div className="nav-actions">
          <Link to="/cart" className="cart-icon">
            <ShoppingCart size={22} />
            {cart.length > 0 && <span className="cart-badge">{cart.reduce((a, b) => a + b.quantity, 0)}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <span className="user-email">{user.email}</span>
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="admin-link">
                  <PlusCircle size={20} />
                </Link>
              )}
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="primary-btn login-btn">
              <User size={18} />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
