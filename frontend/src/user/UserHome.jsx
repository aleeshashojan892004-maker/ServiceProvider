import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserNavbar from './component/UserNavbar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaFemale, FaMale, FaFan, FaBroom, FaBolt, FaWrench,
  FaPaintRoller, FaHammer, FaStar, FaArrowRight
} from 'react-icons/fa';
import { popularServices } from '../data/services';
import './UserHome.css';

const UserHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filteredServices, setFilteredServices] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');

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
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('search');

    console.log("DEBUG: Search Query from URL:", query);

    if (query) {
      setActiveCategory(query);
      const lowerQuery = query.toLowerCase().trim();

      const filtered = popularServices.filter(service => {
        const titleMatch = service.title.toLowerCase().includes(lowerQuery);
        const categoryMatch = service.category.toLowerCase().includes(lowerQuery);
        console.log(`Checking service: ${service.title} (${service.category}) vs query: ${lowerQuery} -> Match: ${titleMatch || categoryMatch}`);
        return titleMatch || categoryMatch;
      });

      console.log("DEBUG: Filtered Results:", filtered);
      setFilteredServices(filtered);
    } else {
      setActiveCategory('All');
      setFilteredServices(popularServices);
    }
  }, [location.search]);

  const handleCategoryClick = (keyword) => {
    navigate(`/user/home?search=${encodeURIComponent(keyword)}`);
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
            {location.search && (
              <button className="clear-filter-btn" onClick={() => navigate('/user/home')}>
                Show All
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {filteredServices.length > 0 ? (
              <motion.div className="services-grid" layout>
                {filteredServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    className="service-card"
                    onClick={() => navigate(`/service/${service.id}`)}
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
                        <span className="review-count">({service.reviews})</span>
                      </div>
                      <div className="price-row">
                        <span className="price">Starts at {service.price}</span>
                        <button className="add-btn">View</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div className="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/search-result-not-found-2130361-1800925.png" alt="No Filter" className="no-result-img" />
                <p>No services found matching your search.</p>
                <button onClick={() => navigate('/user/home')} className="reset-btn">View All Services</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
