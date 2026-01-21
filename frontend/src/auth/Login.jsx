import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { useUser } from '../context/UserContext';
import './Login.css';

const Login = () => {
  const [isProvider, setIsProvider] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateProfile } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userType = isProvider ? 'provider' : 'user';
      const response = await authAPI.login(email, password, userType);
      
      // Store token
      localStorage.setItem('token', response.token);
      
      // Update user context
      updateProfile({
        ...response.user,
        isLoggedIn: true
      });

      // Navigate based on user type
      if (isProvider) {
        navigate('/provider/home');
      } else {
        navigate('/user/home');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Please login to your account</p>
        </div>

        <div className="toggle-container">
          <button 
            className={`toggle-btn ${!isProvider ? 'active' : ''}`}
            onClick={() => setIsProvider(false)}
          >
            User
          </button>
          <button 
            className={`toggle-btn ${isProvider ? 'active' : ''}`}
            onClick={() => setIsProvider(true)}
          >
            Service Provider
          </button>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : `Login as ${isProvider ? 'Provider' : 'User'}`}
          </button>
        </form>

        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
