import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserNavbar from './component/UserNavbar';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaStar, FaUserTie, FaCheckCircle, FaCalendarAlt, FaClock, FaShieldAlt } from 'react-icons/fa';
import './ServiceDetails.css';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');

  // Mock Data
  const serviceData = {
    id: id,
    title: "AC Service & Repair",
    rating: 4.8,
    reviews: "2M+",
    price: 499,
    image: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_600,dpr_1,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1609757629780-2b2187.png",
    description: "Complete AC servicing including filter cleaning, cooling coil cleaning, and gas check. Our network of verified experts ensures your appliance is in safe hands.",
    provider: {
      name: "Rahul Sharma",
      experience: "5 Years",
      verified: true,
      rating: 4.9,
      jobs: 1240
    },
    features: [
      "30-day warranty on service",
      "Background verified partner",
      "Using genuine spare parts",
      "Post-service cleanup"
    ]
  };

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
  ];

  const handleBookNow = () => {
    if (!selectedTime) {
      alert("Please select a time slot for the service.");
      return;
    }

    const booking = {
      serviceId: id,
      date: date.toDateString(),
      time: selectedTime,
      service: serviceData,
      price: serviceData.price
    };

    addToCart(booking);
    navigate('/user/cart');
  };

  return (
    <div className="service-details-page">
      <UserNavbar />
      <div className="details-container">
        <div className="details-grid">
          {/* Left Column: Image & Details */}
          <motion.div
            className="details-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >

            <h1 className="service-title">{serviceData.title}</h1>
            <div className="rating-badge">
              <FaStar className="star-icon" />
              <span>{serviceData.rating} ({serviceData.reviews} bookings)</span>
            </div>

            <div className="service-image-container">
              <img src={serviceData.image} alt={serviceData.title} className="detail-img" />
            </div>

            <div className="features-list">
              <h4><FaShieldAlt style={{ color: '#6e42e5' }} /> UC Promise</h4>
              <ul>
                {serviceData.features.map((feature, index) => (
                  <li key={index}><FaCheckCircle className="check-icon" /> {feature}</li>
                ))}
              </ul>
            </div>

            <div className="provider-card">
              <div className="provider-header">
                <div className="provider-avatar">
                  <FaUserTie />
                </div>
                <div>
                  <h3>{serviceData.provider.name}</h3>
                  <p>Service Partner • {serviceData.provider.experience} Exp</p>
                  <p className="jobs-done">{serviceData.provider.jobs} Jobs Completed</p>
                </div>
                {serviceData.provider.verified && <span className="verified-tag"><FaCheckCircle /> Verified</span>}
              </div>
            </div>

            <div className="description">
              <h3>About the Service</h3>
              <p>{serviceData.description}</p>
            </div>
          </motion.div>

          {/* Right Column: Booking Card (Sticky) */}
          <motion.div
            className="booking-card-wrapper"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="booking-card">
              <div className="booking-header">
                <h3>Select Date & Time</h3>
                <span className="price-tag">₹{serviceData.price}</span>
              </div>

              <div className="calendar-wrapper">
                <Calendar
                  onChange={setDate}
                  value={date}
                  minDate={new Date()}
                  className="custom-calendar"
                />
              </div>

              <div className="time-slots">
                <p>Available Slots</p>
                <div className="slots-grid">
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      className={`slot-btn ${selectedTime === time ? 'active' : ''}`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="booking-footer">
                <button className="book-btn" onClick={handleBookNow}>
                  Proceed to Checkout
                </button>
                <p className="secure-note">
                  <FaShieldAlt /> 100% Safe & Secure Payment
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
