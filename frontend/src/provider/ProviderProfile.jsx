import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { userAPI } from '../utils/api';
import { FaBuilding, FaInfoCircle, FaMapMarkerAlt, FaPhone, FaEnvelope, FaSave, FaArrowLeft, FaBriefcase, FaAward, FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './ProviderProfile.css';

const ProviderProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    bio: '',
    serviceAreas: '',
    experience: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!user.isLoggedIn || user.userType !== 'provider') {
      navigate('/provider/home');
      return;
    }

    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      businessName: user.businessName || '',
      bio: user.bio || '',
      serviceAreas: Array.isArray(user.serviceAreas) 
        ? user.serviceAreas.join(', ') 
        : (user.serviceAreas || ''),
      experience: user.experience?.toString() || '',
      location: user.location?.address || user.location?.city || ''
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Prepare update data
      const updateData = {
        name: formData.name,
        phone: formData.phone
      };

      // Add provider-specific fields
      if (formData.businessName) updateData.businessName = formData.businessName;
      if (formData.bio) updateData.bio = formData.bio;
      if (formData.serviceAreas) {
        updateData.serviceAreas = formData.serviceAreas
          .split(',')
          .map(area => area.trim())
          .filter(area => area.length > 0);
      }
      if (formData.experience) updateData.experience = parseInt(formData.experience) || 0;

      await userAPI.updateProfile(updateData);

      if (formData.location) {
        await userAPI.updateLocation({
          address: formData.location,
          city: formData.location.split(',')[0] || formData.location,
          state: '',
          pincode: ''
        });
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="provider-profile-page">
      <nav className="provider-navbar">
        <button className="back-btn" onClick={() => navigate('/provider/home')}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1>Provider Profile</h1>
        <div></div>
      </nav>

      <div className="provider-profile-container">
        <motion.div
          className="provider-profile-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="profile-header">
            <div className="profile-avatar">
              <FaBuilding />
            </div>
            <h2>Business Information</h2>
            <p>Manage your provider profile and business details</p>
          </div>

          {message.text && (
            <motion.div
              className={`message ${message.type}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {message.text}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="provider-profile-form">
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-group">
                <label>
                  <FaUserCircle className="form-icon" />
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <FaEnvelope className="form-icon" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="form-group">
                <label>
                  <FaPhone className="form-icon" />
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <FaMapMarkerAlt className="form-icon" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter your business location"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Business Information</h3>
              <div className="form-group">
                <label>
                  <FaBuilding className="form-icon" />
                  Business/Company Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="e.g., ABC Electricals, XYZ Plumbing Services"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <FaBriefcase className="form-icon" />
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>
                  <FaMapMarkerAlt className="form-icon" />
                  Service Areas
                </label>
                <input
                  type="text"
                  name="serviceAreas"
                  value={formData.serviceAreas}
                  onChange={handleChange}
                  placeholder="e.g., Mumbai, Delhi, Bangalore (comma-separated)"
                />
                <small className="form-hint">Cities or areas where you provide services</small>
              </div>

              <div className="form-group">
                <label>
                  <FaInfoCircle className="form-icon" />
                  Bio/Description
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell customers about your business, experience, expertise, and what makes you unique..."
                  rows="5"
                  className="form-textarea"
                />
                <small className="form-hint">This will be visible to customers viewing your services</small>
              </div>
            </div>

            {user.verified && (
              <div className="verified-badge">
                <FaAward /> Verified Provider
              </div>
            )}

            <button type="submit" className="save-btn" disabled={loading}>
              <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProviderProfile;
