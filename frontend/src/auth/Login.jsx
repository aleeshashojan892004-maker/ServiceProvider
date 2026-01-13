import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [isProvider, setIsProvider] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login logic
    if (isProvider) {
      navigate('/provider/home');
    } else {
      navigate('/user/home');
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
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email" required />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" required />
          </div>

          <button type="submit" className="login-submit-btn">
            Login as {isProvider ? 'Provider' : 'User'}
          </button>
        </form>

        <p className="signup-link">
          Don't have an account? <span>Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
