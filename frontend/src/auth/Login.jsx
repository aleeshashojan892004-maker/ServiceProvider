import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { useUser } from '../context/UserContext';
import './Login.css';

const Login = () => {
  const [userType, setUserType] = useState('user'); // 'user', 'provider', 'admin'
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
      // For admin login, don't pass userType to allow flexibility
      const loginUserType = userType === 'user' ? undefined : userType;
      const response = await authAPI.login(email, password, loginUserType);
      
      console.log('Login successful, userType:', response.user.userType); // Debug
      
      // Store token
      localStorage.setItem('token', response.token);
      
      // Update user context immediately with all user data including userType
      const userData = {
        ...response.user,
        isLoggedIn: true,
        userType: response.user.userType // Explicitly preserve userType
      };
      
      console.log('Updating user context with:', userData); // Debug
      updateProfile(userData);

      // Navigate based on user type immediately
      if (response.user.userType === 'admin') {
        console.log('Redirecting admin to dashboard');
        navigate('/admin/dashboard', { replace: true });
      } else if (response.user.userType === 'provider') {
        navigate('/provider/home', { replace: true });
      } else {
        navigate('/user/home', { replace: true });
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
            className={`toggle-btn ${userType === 'user' ? 'active' : ''}`}
            onClick={() => setUserType('user')}
          >
            User
          </button>
          <button 
            className={`toggle-btn ${userType === 'provider' ? 'active' : ''}`}
            onClick={() => setUserType('provider')}
          >
            Provider
          </button>
          <button 
            className={`toggle-btn ${userType === 'admin' ? 'active' : ''}`}
            onClick={() => setUserType('admin')}
          >
            Admin
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
            {loading ? 'Logging in...' : `Login as ${userType.charAt(0).toUpperCase() + userType.slice(1)}`}
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
