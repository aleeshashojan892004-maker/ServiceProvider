import React, { useState, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt, FaUserCircle, FaChevronDown, FaTimes, FaShoppingCart, FaPen, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import './UserNavbar.css';

const UserNavbar = () => {
  const { user, updateProfile, updateLocation, logout } = useUser();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const locationHook = useLocation();
  const { cart } = useCart();

  // Sync search input with URL
  useEffect(() => {
    const params = new URLSearchParams(locationHook.search);
    const q = params.get('search');
    if (q) setSearchQuery(q);
  }, [locationHook.search]);

  const cities = [
    "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune"
  ];

  const handleLocationSelect = async (city) => {
    try {
      await updateLocation({ 
        address: city,
        city: city,
        state: '',
        pincode: ''
      });
      setShowLocationModal(false);
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  };

  const handleSearch = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && searchQuery.trim()) {
      navigate(`/user/home?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    updateProfile({ name: formData.get('name') });
    setShowProfileModal(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <h1 className="logo" onClick={() => navigate('/user/home')}>ServicePro</h1>
          </div>

          <div className="navbar-center">
            <div className="location-wrapper" onClick={() => setShowLocationModal(true)}>
              <FaMapMarkerAlt className="icon" />
              <span className="location-text">
                {typeof user.location === 'string' 
                  ? user.location 
                  : (user.location?.address || user.location?.city || "Select Location")}
              </span>
              <FaChevronDown className="dropdown-icon" />
            </div>
            <div className="search-wrapper">
              <FaSearch className="search-icon" onClick={handleSearch} style={{ cursor: 'pointer' }} />
              <input
                type="text"
                placeholder="Search for 'AC', 'Salon'..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                aria-label="Search services"
              />
            </div>
          </div>

          <div className="navbar-right">
            <div className="nav-link" onClick={() => navigate('/user/orders')}>
              <span>Orders</span>
            </div>
            <div className="nav-link cart-link" onClick={() => navigate('/user/cart')}>
              <FaShoppingCart className="cart-icon-nav" />
              <span>Cart</span>
              {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </div>
            <div className="nav-link" onClick={() => navigate('/user/profile')}>
              <div className="user-profile">
                <FaUserCircle className="user-icon" />
                <span>{user.name || 'Profile'}</span>
              </div>
            </div>
            <button 
              className="nav-link logout-btn-nav" 
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Logout"
            >
              <FaSignOutAlt className="logout-icon" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Location Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <motion.div
            className="modal-overlay"
            onClick={() => setShowLocationModal(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="location-modal"
              onClick={e => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <div className="modal-header">
                <h3>Select Location</h3>
                <FaTimes className="close-icon" onClick={() => setShowLocationModal(false)} />
              </div>
              <div className="city-grid">
                {cities.map(city => {
                  const currentLocation = typeof user.location === 'string' 
                    ? user.location 
                    : (user.location?.city || user.location?.address || '');
                  return (
                    <button
                      key={city}
                      className={`city-btn ${currentLocation === city ? 'active' : ''}`}
                      onClick={() => handleLocationSelect(city)}
                    >
                      {city}
                    </button>
                  );
                })}
              </div>
              <div className="detect-location">
                <FaMapMarkerAlt /> <span>Detect my current location</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            className="modal-overlay"
            onClick={() => setShowProfileModal(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="location-modal"
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="modal-header">
                <h3>Edit Profile</h3>
                <FaTimes className="close-icon" onClick={() => setShowProfileModal(false)} />
              </div>
              <form onSubmit={handleProfileSave} className="profile-form">
                <div className="input-group">
                  <label>Name</label>
                  <input type="text" name="name" defaultValue={user.name} autoFocus />
                </div>
                <div className="input-group">
                  <label>Phone Number</label>
                  <input type="text" value="+91 98765 43210" disabled style={{ background: '#f5f5f5', color: '#999' }} />
                </div>
                <button type="submit" className="save-btn">Save Changes</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserNavbar;
