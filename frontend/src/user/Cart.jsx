import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavbar from './component/UserNavbar';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaArrowLeft, FaCheckCircle, FaCalendarAlt, FaClock, FaShieldAlt } from 'react-icons/fa';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const total = getCartTotal();
  const tax = Math.round(total * 0.18);
  const finalTotal = total + tax;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    alert("Order placed successfully! Thank you for booking.");
    clearCart();
    navigate('/user/home');
  };

  return (
    <div className="cart-page">
      <UserNavbar />
      <div className="cart-container">
        <h1>My Cart ({cart.length})</h1>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-2130356-1800917.png" alt="Empty Cart" className="empty-img" />
            </motion.div>
            <p>Your cart is empty</p>
            <button className="continue-shopping-btn" onClick={() => navigate('/user/home')}>
              <FaArrowLeft style={{ marginRight: '8px' }} /> Browse Services
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.cartId}
                    className="cart-item"
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0, margin: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="cart-item-left">
                      <img src={item.service.image} alt={item.service.title} className="cart-item-img" />
                      <div className="cart-item-details">
                        <h3>{item.service.title}</h3>
                        <div className="item-meta">
                          <span className="meta-tag"><FaCalendarAlt /> {item.date}</span>
                          <span className="meta-tag"><FaClock /> {item.time}</span>
                        </div>
                        <div className="item-price">₹{item.service.price}</div>
                      </div>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.cartId)}>
                      <FaTrash /> Remove
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <motion.div
              className="cart-summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3>Payment Summary</h3>
              <div className="summary-row">
                <span>Item Total</span>
                <span>₹{total}</span>
              </div>
              <div className="summary-row">
                <span>Taxes & Fees (18%)</span>
                <span>₹{tax}</span>
              </div>

              <div className="summary-total">
                <span>Total Amount</span>
                <span>₹{finalTotal}</span>
              </div>

              <div className="savings-banner">
                <FaCheckCircle /> You are saving ₹50 on this order!
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Pay <FaArrowLeft style={{ transform: 'rotate(180deg)', marginLeft: '8px' }} />
              </button>

              <p className="checkout-note">
                <FaShieldAlt /> Safe and secure payments
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
