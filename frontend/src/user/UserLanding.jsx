import React from 'react';
import { Link } from 'react-router-dom';
import './UserLanding.css';

function UserLanding() {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">ServicePro</h1>
        <p className="landing-subtitle">Your one-stop solution for all home services</p>
        
        <div className="landing-buttons">
          <Link to="/login">
            <button className="btn-primary">
              Login / Sign Up
            </button>
          </Link>
          <Link to="/user/home">
            <button className="btn-outline">
              Browse as Guest
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UserLanding;
