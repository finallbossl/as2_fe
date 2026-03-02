import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, ExternalLink } from 'lucide-react';
import { useStore } from '../store/useStore';
import './Orders.css';

const Orders = () => {
  const { orders, fetchOrders } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders().finally(() => setLoading(false));
  }, [fetchOrders]);

  if (loading) return (
    <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
      <h1>Loading Your Orders...</h1>
    </div>
  );

  return (
    <div className="orders-page container">
      <div className="orders-header">
        <h1>Your <span>Order History</span></h1>
        <p>Track and manage your past elite acquisitions</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card glass">
            <div className="order-info-header">
              <div className="info-group">
                <span className="label">ORDER ID</span>
                <span className="value">#000{order.id}</span>
              </div>
              <div className="info-group">
                <span className="label">DATE</span>
                <span className="value">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="info-group">
                <span className="label">TOTAL</span>
                <span className="value primary-text">${order.totalAmount}</span>
              </div>
              <div className={`status-badge ${order.status.toLowerCase()}`}>
                {order.status === 'PAID' || order.status === 'COMPLETED' ? <CheckCircle size={14} /> : <Clock size={14} />}
                {order.status}
              </div>
            </div>

            <div className="order-items-preview">
              {order.items.map((item, idx) => (
                <div key={idx} className="order-item-row">
                  <span className="item-name">{item.product.name} x {item.quantity}</span>
                  <span className="item-price">${item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <button className="secondary-btn"><ExternalLink size={16} /> View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
