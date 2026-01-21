import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserNavbar from './component/UserNavbar';
import { bookingsAPI } from '../utils/api';
import { motion } from 'framer-motion';
import { 
  FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCheckCircle, 
  FaHourglassHalf, FaTimesCircle, FaArrowLeft, FaPhone, FaEnvelope 
} from 'react-icons/fa';
import './OrderDetails.css';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getBookingById(id);
      setBooking(response.booking);
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Failed to load order details');
      navigate('/user/orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FFA500';
      case 'confirmed':
        return '#4CAF50';
      case 'in-progress':
        return '#2196F3';
      case 'completed':
        return '#8BC34A';
      case 'cancelled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaHourglassHalf />;
      case 'confirmed':
        return <FaCheckCircle />;
      case 'completed':
        return <FaCheckCircle />;
      case 'cancelled':
        return <FaTimesCircle />;
      default:
        return <FaHourglassHalf />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="order-details-page">
        <UserNavbar />
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="order-details-page">
        <UserNavbar />
        <div className="error-state">
          <p>Order not found</p>
          <button onClick={() => navigate('/user/orders')}>Back to Orders</button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-details-page">
      <UserNavbar />
      <div className="order-details-container">
        <button className="back-btn" onClick={() => navigate('/user/orders')}>
          <FaArrowLeft /> Back to Orders
        </button>

        <motion.div
          className="order-details-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="order-header">
            <div>
              <h1>Order Details</h1>
              <p className="order-id">Order ID: #{booking.id}</p>
            </div>
            <span 
              className="status-badge-large"
              style={{ backgroundColor: getStatusColor(booking.status) + '20', color: getStatusColor(booking.status) }}
            >
              {getStatusIcon(booking.status)} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>

          <div className="order-content">
            <div className="order-section">
              <h2>Service Information</h2>
              <div className="service-info">
                <img 
                  src={booking.service?.image || 'https://via.placeholder.com/150'} 
                  alt={booking.service?.title}
                  className="service-image"
                />
                <div className="service-details">
                  <h3>{booking.service?.title || 'Service'}</h3>
                  <p className="service-category">{booking.service?.category}</p>
                  <p className="service-description">{booking.service?.description || 'Professional service'}</p>
                  <div className="service-price">₹{parseFloat(booking.totalAmount).toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className="order-section">
              <h2>Booking Details</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <FaCalendarAlt className="detail-icon" />
                  <div>
                    <label>Booking Date</label>
                    <p>{formatDate(booking.bookingDate)}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <FaClock className="detail-icon" />
                  <div>
                    <label>Time Slot</label>
                    <p>{booking.bookingTime}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <FaMapMarkerAlt className="detail-icon" />
                  <div>
                    <label>Service Address</label>
                    <p>{booking.address}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <FaCheckCircle className="detail-icon" />
                  <div>
                    <label>Payment Status</label>
                    <p className="capitalize">{booking.paymentStatus}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-section">
              <h2>Payment Summary</h2>
              <div className="payment-summary">
                <div className="summary-row">
                  <span>Service Amount</span>
                  <span>₹{parseFloat(booking.totalAmount).toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Amount</span>
                  <span>₹{parseFloat(booking.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetails;
