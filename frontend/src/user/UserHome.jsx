import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserNavbar from './component/UserNavbar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaFemale, FaMale, FaFan, FaBroom, FaBolt, FaWrench,
  FaPaintRoller, FaHammer, FaStar, FaArrowRight, FaFilter, FaTimes
} from 'react-icons/fa';
import { servicesAPI } from '../utils/api';
import './UserHome.css';

const UserHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    sortBy: ''
  });

  const categories = [
    { id: 1, name: "Women's Salon", icon: <FaFemale />, keyword: "Salon", color: "#FFEFF6" },
    { id: 2, name: "Men's Salon", icon: <FaMale />, keyword: "Men", color: "#F0F6FF" },
    { id: 3, name: "AC & Appliance", icon: <FaFan />, keyword: "AC", color: "#FFF5E6" },
    { id: 4, name: "Cleaning", icon: <FaBroom />, keyword: "Cleaning", color: "#E6FFF2" },
    { id: 5, name: "Electrician", icon: <FaBolt />, keyword: "Electrician", color: "#FFF9E6" },
    { id: 6, name: "Plumber", icon: <FaWrench />, keyword: "Plumber", color: "#E6F4FF" },
    { id: 7, name: "Painting", icon: <FaPaintRoller />, keyword: "Painting", color: "#FFE6E6" },
    { id: 8, name: "Carpentry", icon: <FaHammer />, keyword: "Carpentry", color: "#F2E6FF" },
  ];

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const searchParams = new URLSearchParams(location.search);
        const searchQuery = searchParams.get('search');
        
        const filtersToApply = {
          ...filters,
          search: searchQuery || ''
        };

        const response = await servicesAPI.getServices(filtersToApply);
        setServices(response.services || []);
        
        if (searchQuery) {
          setActiveCategory(searchQuery);
        } else {
          setActiveCategory('All');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [location.search, filters]);

  const handleCategoryClick = (keyword) => {
    navigate(`/user/home?search=${encodeURIComponent(keyword)}`);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      sortBy: ''
    });
    navigate('/user/home');
  };

  const formatPrice = (price) => {
    return `₹${price}`;
  };

  const formatReviews = (reviews) => {
    if (reviews >= 1000000) return `${(reviews / 1000000).toFixed(1)}M+`;
    if (reviews >= 1000) return `${(reviews / 1000).toFixed(0)}k+`;
    return `${reviews}+`;
  };

  return (
    <div className="user-home">
      <UserNavbar />

      <div className="home-container">
        {/* Modern Hero Section */}
        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-content">
            <h1 className="hero-title">Home services at your <br /> <span className="highlight">doorstep</span></h1>

            <div className="categories-wrapper">
              <h3>What are you looking for?</h3>
              <div className="categories-grid">
                {categories.map((cat, index) => (
                  <motion.div
                    key={cat.id}
                    className="category-item"
                    onClick={() => handleCategoryClick(cat.keyword)}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="category-icon-box" style={{ backgroundColor: cat.color }}>
                      {cat.icon}
                    </div>
                    <span className="category-name">{cat.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Banner */}
        <motion.div
          className="banner-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="banner-card">
            <div className="banner-text">
              <h3>Get 50% off on your first booking!</h3>
              <p>Use code: <strong>FIRST50</strong></p>
              <button className="banner-btn">Book Now <FaArrowRight /></button>
            </div>
            <div className="banner-visual">
              <div className="circle-decor"></div>
            </div>
          </div>
        </motion.div>

        {/* Services Section with Filter Pills */}
        <div id="services-section" className="section">
          <div className="section-header">
            <h2>{location.search ? `Results for "${new URLSearchParams(location.search).get('search')}"` : 'Most Booked Services'}</h2>
            <div className="section-header-actions">
              <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
                <FaFilter /> Filters
              </button>
              {(location.search || Object.values(filters).some(f => f)) && (
                <button className="clear-filter-btn" onClick={clearFilters}>
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="filters-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div className="filters-content">
                  <div className="filter-group">
                    <label>Category</label>
                    <select 
                      value={filters.category} 
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <option value="">All Categories</option>
                      <option value="AC">AC & Appliance</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Electrician">Electrician</option>
                      <option value="Plumber">Plumber</option>
                      <option value="Men">Men's Salon</option>
                      <option value="Salon">Women's Salon</option>
                      <option value="Painting">Painting</option>
                      <option value="Carpentry">Carpentry</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Price Range</label>
                    <div className="price-inputs">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      />
                      <span>to</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="filter-group">
                    <label>Minimum Rating</label>
                    <select 
                      value={filters.minRating} 
                      onChange={(e) => handleFilterChange('minRating', e.target.value)}
                    >
                      <option value="">Any Rating</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.0">4.0+ Stars</option>
                      <option value="3.5">3.5+ Stars</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Sort By</label>
                    <select 
                      value={filters.sortBy} 
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                      <option value="">Default</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading services...</p>
              </div>
            ) : services.length > 0 ? (
              <motion.div className="services-grid" layout>
                {services.map((service, index) => (
                  <motion.div
                    key={service._id || service.id}
                    className="service-card"
                    onClick={() => navigate(`/service/${service._id || service.id}`)}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -8, boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}
                  >
                    <div className="image-wrapper">
                      <img src={service.image} alt={service.title} className="service-img" />
                      {index < 3 && !location.search && <span className="bestseller-tag">Bestseller</span>}
                    </div>
                    <div className="service-info">
                      <h3 className="service-title">{service.title}</h3>
                      <div className="rating-box">
                        <FaStar className="star-icon" />
                        <span className="rating-val">{service.rating}</span>
                        <span className="review-count">({formatReviews(service.reviews)})</span>
                      </div>
                      <div className="price-row">
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 500, marginBottom: '0.25rem' }}>
                            Starts at
                          </div>
                          <span className="price">{formatPrice(service.price)}</span>
                        </div>
                        <button 
                          className="add-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/service/${service._id || service.id}`);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div className="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/search-result-not-found-2130361-1800925.png" alt="No Filter" className="no-result-img" />
                <p>No services found matching your search.</p>
                <button onClick={clearFilters} className="reset-btn">View All Services</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
