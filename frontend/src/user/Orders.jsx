import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavbar from './component/UserNavbar';
import { bookingsAPI } from '../utils/api';
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaEye } from 'react-icons/fa';
import './Orders.css';

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed

  useEffect(() => {
    if (!user.isLoggedIn) {
      navigate('/login');
      return;
    }

    fetchBookings();
  }, [filter, user.isLoggedIn]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const status = filter !== 'all' ? filter : null;
      const response = await bookingsAPI.getMyBookings(status);
      setBookings(response.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
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
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  return (
    <div className="orders-page">
      <UserNavbar />
      <div className="orders-container">
        <div className="orders-header">
          <h1>My Orders</h1>
          {pendingCount > 0 && (
            <span className="pending-badge">{pendingCount} Pending</span>
          )}
        </div>

        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Orders
          </button>
          <button 
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-tab ${filter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            Confirmed
          </button>
          <button 
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="empty-orders">
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-box-2130361-1800925.png" alt="No orders" />
            <h3>No orders found</h3>
            <p>You haven't placed any orders yet.</p>
            <button onClick={() => navigate('/user/home')} className="browse-btn">
              Browse Services
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                className="order-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/user/orders/${booking.id}`)}
              >
                <div className="order-image">
                  <img 
                    src={booking.service?.image || 'https://via.placeholder.com/150'} 
                    alt={booking.service?.title} 
                  />
                </div>
                <div className="order-details">
                  <h3>{booking.service?.title || 'Service'}</h3>
                  <div className="order-meta">
                    <span className="meta-item">
                      <FaCalendarAlt /> {formatDate(booking.bookingDate)}
                    </span>
                    <span className="meta-item">
                      <FaClock /> {booking.bookingTime}
                    </span>
                    <span className="meta-item">
                      <FaMapMarkerAlt /> {booking.address}
                    </span>
                  </div>
                  <div className="order-footer">
                    <div className="order-status">
                      <span 
                        className="status-badge"
                        style={{ color: getStatusColor(booking.status) }}
                      >
                        {getStatusIcon(booking.status)} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <div className="order-amount">
                      ₹{parseFloat(booking.totalAmount).toFixed(2)}
                    </div>
                  </div>
                </div>
                <button className="view-details-btn">
                  <FaEye /> View Details
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
