import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaStar, FaTimes, FaCalendarAlt, FaUser, FaPhone, FaMapMarkerAlt, FaUserCircle } from 'react-icons/fa';
import { providerAPI } from '../utils/api';
import { useUser } from '../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import './ProviderHome.css';

const ProviderHome = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalEarnings: 0,
    avgRating: 0,
    totalServices: 0
  });
  const [loading, setLoading] = useState(true);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    image: ''
  });

  useEffect(() => {
    // Redirect if not logged in or not a provider
    if (!user.isLoggedIn) {
      navigate('/login');
      return;
    }
    if (user.userType !== 'provider') {
      navigate('/user/home');
      return;
    }

    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [servicesRes, statsRes, bookingsRes] = await Promise.all([
        providerAPI.getMyServices(),
        providerAPI.getStats(),
        providerAPI.getMyBookings()
      ]);

      setServices(servicesRes.services || []);
      setStats(statsRes.stats || stats);
      setBookings(bookingsRes.bookings || []);
    } catch (error) {
      console.error('Error fetching provider data:', error);
      if (error.message.includes('403') || error.message.includes('Access denied')) {
        alert('You must be a provider to access this page.');
        navigate('/user/home');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = () => {
    setEditingService(null);
    setServiceForm({
      title: '',
      category: '',
      description: '',
      price: '',
      image: ''
    });
    setShowServiceModal(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      title: service.title,
      category: service.category,
      description: service.description || '',
      price: service.price.toString(),
      image: service.image || ''
    });
    setShowServiceModal(true);
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      await providerAPI.deleteService(id);
      await fetchData();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service. Please try again.');
    }
  };

  const handleToggleServiceStatus = async (service) => {
    try {
      await providerAPI.updateService(service.id, {
        isActive: !service.isActive
      });
      await fetchData();
    } catch (error) {
      console.error('Error updating service status:', error);
      alert('Failed to update service status. Please try again.');
    }
  };

  const handleSubmitService = async (e) => {
    e.preventDefault();
    
    if (!serviceForm.title || !serviceForm.category || !serviceForm.price) {
      alert('Please fill in all required fields (Title, Category, Price)');
      return;
    }

    try {
      if (editingService) {
        await providerAPI.updateService(editingService.id, serviceForm);
      } else {
        await providerAPI.createService(serviceForm);
      }
      setShowServiceModal(false);
      await fetchData();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service. Please try again.');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await providerAPI.updateBookingStatus(bookingId, newStatus);
      await fetchData();
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status. Please try again.');
    }
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toFixed(0)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatEarnings = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}k`;
    }
    return `₹${amount}`;
  };

  const categories = [
    "AC & Appliance", "Cleaning", "Electrician", "Plumber",
    "Men's Salon", "Women's Salon", "Painting", "Carpentry"
  ];

  if (loading) {
    return (
      <div className="provider-dashboard">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="provider-dashboard">
      <nav className="provider-navbar">
        <h1>Provider Dashboard</h1>
        <div className="provider-profile">
          <button 
            onClick={() => navigate('/provider/profile')}
            className="profile-btn"
            title="View Profile"
          >
            <FaUserCircle /> {user.businessName || user.name || 'Provider'}
          </button>
          <img 
            src={user.profilePic || 'https://via.placeholder.com/40'} 
            alt="Profile" 
            className="profile-img" 
          />
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }} 
            className="logout-btn"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${!showBookings ? 'active' : ''}`}
            onClick={() => setShowBookings(false)}
          >
            My Services
          </button>
          <button 
            className={`tab-btn ${showBookings ? 'active' : ''}`}
            onClick={() => setShowBookings(true)}
          >
            Bookings ({bookings.length})
          </button>
        </div>

        {!showBookings ? (
          <>
            <div className="dashboard-header">
              <div className="header-text">
                <h2>My Services</h2>
                <p>Manage the services you provide to customers</p>
              </div>
              <button className="add-service-btn" onClick={handleAddService}>
                <FaPlus /> Add New Service
              </button>
            </div>

            <div className="stats-cards">
              <div className="stat-card">
                <h3>Total Bookings</h3>
                <div className="stat-value">{stats.totalBookings}</div>
              </div>
              <div className="stat-card">
                <h3>Total Earnings</h3>
                <div className="stat-value">{formatEarnings(stats.totalEarnings)}</div>
              </div>
              <div className="stat-card">
                <h3>Avg Rating</h3>
                <div className="stat-value">
                  {stats.avgRating.toFixed(1)} <FaStar className="star-icon" />
                </div>
              </div>
              <div className="stat-card">
                <h3>Total Services</h3>
                <div className="stat-value">{stats.totalServices}</div>
              </div>
            </div>

            <div className="services-list">
              {services.length === 0 ? (
                <div className="empty-state">
                  <p>No services yet. Add your first service to get started!</p>
                </div>
              ) : (
                services.map((service) => (
                  <motion.div
                    key={service.id}
                    className="provider-service-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="service-details">
                      {service.image && (
                        <img src={service.image} alt={service.title} className="service-thumbnail" />
                      )}
                      <div>
                        <h3>{service.title}</h3>
                        <p className="service-category">{service.category}</p>
                        <div className="service-meta">
                          <span className="price">{formatPrice(service.price)}</span>
                          <span className="rating">
                            <FaStar /> {parseFloat(service.rating).toFixed(1)}
                          </span>
                          <span className="reviews">({service.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                    <div className="service-actions">
                      <span 
                        className={`status-badge ${service.isActive ? 'active' : 'inactive'}`}
                        onClick={() => handleToggleServiceStatus(service)}
                        style={{ cursor: 'pointer' }}
                      >
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <button 
                        className="action-btn edit" 
                        onClick={() => handleEditService(service)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="action-btn delete" 
                        onClick={() => handleDeleteService(service.id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="bookings-section">
            <h2>My Bookings</h2>
            {bookings.length === 0 ? (
              <div className="empty-state">
                <p>No bookings yet.</p>
              </div>
            ) : (
              <div className="bookings-list">
                {bookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    className="booking-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="booking-header">
                      <div>
                        <h3>{booking.service?.title || 'Service'}</h3>
                        <span className={`status-badge ${booking.status}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="booking-price">
                        {formatPrice(booking.totalAmount)}
                      </div>
                    </div>
                    <div className="booking-details">
                      <div className="booking-info">
                        <FaCalendarAlt /> {formatDate(booking.bookingDate)} at {booking.bookingTime}
                      </div>
                      <div className="booking-info">
                        <FaMapMarkerAlt /> {booking.address}
                      </div>
                      {booking.user && (
                        <>
                          <div className="booking-info">
                            <FaUser /> {booking.user.name}
                          </div>
                          {booking.user.phone && (
                            <div className="booking-info">
                              <FaPhone /> {booking.user.phone}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="booking-actions">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            className="btn-approve"
                            onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                          >
                            ✓ Approve
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to reject this booking?')) {
                                handleUpdateBookingStatus(booking.id, 'cancelled');
                              }
                            }}
                          >
                            ✗ Reject
                          </button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <>
                          <button
                            className="btn-progress"
                            onClick={() => handleUpdateBookingStatus(booking.id, 'in-progress')}
                          >
                            Start Service
                          </button>
                        </>
                      )}
                      {booking.status === 'in-progress' && (
                        <button
                          className="btn-complete"
                          onClick={() => handleUpdateBookingStatus(booking.id, 'completed')}
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Service Modal */}
      <AnimatePresence>
        {showServiceModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowServiceModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowServiceModal(false)}
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmitService} className="service-form">
                <div className="form-group">
                  <label>Service Title *</label>
                  <input
                    type="text"
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    placeholder="e.g., AC Repair & Service"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    placeholder="e.g., 499"
                    min="0"
                    step="0.01"
                    required
                  />
                  <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                    Set the price customers will pay for this service
                  </small>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    placeholder="Describe your service..."
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    value={serviceForm.image}
                    onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowServiceModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    {editingService ? 'Update Service' : 'Create Service'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProviderHome;
