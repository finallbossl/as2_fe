import { useStore } from '../store/useStore';
import { Trash2, Plus, Minus, ArrowLeft, CreditCard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, user, placeOrder } = useStore();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
    } else {
      try {
        await placeOrder();
        alert("Order placed successfully! Redirecting to history...");
        navigate('/orders');
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty container">
        <div className="empty-content glass">
          <h2>Your cart is empty</h2>
          <p>But it doesn't have to be. Browse our latest arrivals and find something you'll love.</p>
          <Link to="/" className="primary-btn">
            <ArrowLeft size={18} />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <div className="cart-header">
        <h1>Your <span>Shopping Bag</span></h1>
        <p>You have {cart.reduce((a, b) => a + b.quantity, 0)} items in your cart</p>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item glass">
              <div className="item-image">
                <img src={item.imageUrl} alt={item.name} />
              </div>
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-price">${item.price}</p>
                <div className="item-controls">
                  <div className="quantity-badge glass">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary glass">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cartTotal().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>${cartTotal().toFixed(2)}</span>
          </div>
          <button onClick={handleCheckout} className="primary-btn checkout-btn">
            <CreditCard size={18} />
            Checkout Now
          </button>
          <Link to="/" className="continue-shopping">
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
