import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { useUser } from '../context/UserContext';
import './Login.css';

const Signup = () => {
  const [userType, setUserType] = useState('user'); // 'user', 'provider', 'admin'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    businessName: '',
    bio: '',
    serviceAreas: '',
    experience: '',
    adminKey: '' // For admin signup
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateProfile } = useUser();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    setLoading(true);

    try {
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        userType: userType
      };

      // Add provider-specific fields
      if (userType === 'provider') {
        if (formData.businessName) registerData.businessName = formData.businessName;
        if (formData.bio) registerData.bio = formData.bio;
        if (formData.serviceAreas) {
          // Split by comma and trim each area
          registerData.serviceAreas = formData.serviceAreas
            .split(',')
            .map(area => area.trim())
            .filter(area => area.length > 0);
        }
        if (formData.experience) registerData.experience = parseInt(formData.experience) || 0;
      }

      // Add admin key if admin signup
      if (userType === 'admin') {
        if (!formData.adminKey) {
          setError('Admin key is required for admin registration');
          setLoading(false);
          return;
        }
        registerData.adminKey = formData.adminKey;
      }

      const response = await authAPI.register(registerData);

      // Store token
      localStorage.setItem('token', response.token);


      console.log('Registration successful, user:', response.user); // Debug

      // Update user context with all user data including userType
      const userData = {
        ...response.user,
        isLoggedIn: true,
        userType: response.user.userType // Explicitly preserve userType
      };

      console.log('Updating user context with:', userData); // Debug
      updateProfile(userData);

      // Navigate based on user type
      if (response.user.userType === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (response.user.userType === 'provider') {
        navigate('/provider/home', { replace: true });
      } else {
        navigate('/user/home', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h2>Create Account</h2>
          <p>Sign up to get started</p>
        </div>

        <div className="toggle-container">
          <button
            type="button"
            className={`toggle-btn ${userType === 'user' ? 'active' : ''}`}
            onClick={() => setUserType('user')}
          >
            User
          </button>
          <button
            type="button"
            className={`toggle-btn ${userType === 'provider' ? 'active' : ''}`}
            onClick={() => setUserType('provider')}
          >
            Provider
          </button>
          <button
            type="button"
            className={`toggle-btn ${userType === 'admin' ? 'active' : ''}`}
            onClick={() => setUserType('admin')}
          >
            Admin
          </button>
        </div>

        {userType === 'provider' && (
          <div className="provider-info-box">
            <p className="provider-info-text">
              💼 Provide services to customers and grow your business
            </p>
          </div>
        )}

        {userType === 'admin' && (
          <div className="provider-info-box" style={{ background: '#fff3cd', borderColor: '#ffc107' }}>
            <p className="provider-info-text" style={{ color: '#856404' }}>
              🔐 Admin registration requires a valid admin key. Contact system administrator for access.
            </p>
          </div>
        )}

        <form onSubmit={handleSignup} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number {(userType === 'provider' || userType === 'admin') && <span className="required">*</span>}</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required={userType === 'provider' || userType === 'admin'}
            />
          </div>

          {userType === 'provider' && (
            <>
              <div className="form-group">
                <label>Business/Company Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="businessName"
                  placeholder="e.g., ABC Electricals, XYZ Plumbing Services"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Years of Experience</label>
                <input
                  type="number"
                  name="experience"
                  placeholder="e.g., 5"
                  value={formData.experience}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Service Areas</label>
                <input
                  type="text"
                  name="serviceAreas"
                  placeholder="e.g., Mumbai, Delhi, Bangalore (comma-separated)"
                  value={formData.serviceAreas}
                  onChange={handleChange}
                />
                <small className="form-hint">Cities or areas where you provide services</small>
              </div>

              <div className="form-group">
                <label>Bio/Description</label>
                <textarea
                  name="bio"
                  placeholder="Tell customers about your business, experience, and expertise..."
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  className="form-textarea"
                />
              </div>
            </>
          )}

          {userType === 'admin' && (
            <div className="form-group">
              <label>Admin Key <span className="required">*</span></label>
              <input
                type="password"
                name="adminKey"
                placeholder="Enter admin registration key"
                value={formData.adminKey}
                onChange={handleChange}
                required
              />
              <small className="form-hint">Required for admin account creation</small>
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? 'Creating account...' : `Sign up as ${userType.charAt(0).toUpperCase() + userType.slice(1)}`}
          </button>
        </form>

        <p className="signup-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
