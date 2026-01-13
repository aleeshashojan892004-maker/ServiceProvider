import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaStar } from 'react-icons/fa';
import './ProviderHome.css';

const ProviderHome = () => {
  // Mock data for services provided by the logged-in provider
  const [services, setServices] = useState([
    { id: 1, title: "AC Repair & Service", price: "₹499", rating: 4.8, bookings: 120, status: "Active" },
    { id: 2, title: "AC Gas Refill", price: "₹1499", rating: 4.6, bookings: 85, status: "Active" },
    { id: 3, title: "Window AC Installation", price: "₹799", rating: 4.9, bookings: 45, status: "Inactive" },
  ]);

  return (
    <div className="provider-dashboard">
      <nav className="provider-navbar">
        <h1>Provider Dashboard</h1>
        <div className="provider-profile">
          <span>John's Electricals</span>
          <img src="https://via.placeholder.com/40" alt="Profile" className="profile-img" />
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-text">
            <h2>My Services</h2>
            <p>Manage the services you provide to customers</p>
          </div>
          <button className="add-service-btn">
            <FaPlus /> Add New Service
          </button>
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <h3>Total Bookings</h3>
            <div className="stat-value">250</div>
          </div>
          <div className="stat-card">
            <h3>Total Earnings</h3>
            <div className="stat-value">₹1.2L</div>
          </div>
          <div className="stat-card">
            <h3>Avg Rating</h3>
            <div className="stat-value">4.8 <FaStar className="star-icon" /></div>
          </div>
        </div>

        <div className="services-list">
          {services.map((service) => (
            <div key={service.id} className="provider-service-card">
              <div className="service-details">
                <h3>{service.title}</h3>
                <div className="service-meta">
                  <span className="price">{service.price}</span>
                  <span className="rating"><FaStar /> {service.rating}</span>
                  <span className="bookings">{service.bookings} Bookings</span>
                </div>
              </div>
              <div className="service-actions">
                <span className={`status-badge ${service.status.toLowerCase()}`}>{service.status}</span>
                <button className="action-btn edit"><FaEdit /></button>
                <button className="action-btn delete"><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProviderHome;
