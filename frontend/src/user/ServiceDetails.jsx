import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserNavbar from './component/UserNavbar';
import { useCart } from '../context/CartContext';
import { servicesAPI } from '../utils/api';
import { motion } from 'framer-motion';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaStar, FaUserTie, FaCheckCircle, FaCalendarAlt, FaClock, FaShieldAlt, FaExclamationCircle } from 'react-icons/fa';
import './ServiceDetails.css';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState({});
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await servicesAPI.getServiceById(id);
        setServiceData({
          ...response.service,
          features: [
            "30-day warranty on service",
            "Background verified partner",
            "Using genuine spare parts",
            "Post-service cleanup"
          ],
          provider: {
            name: "Rahul Sharma",
            experience: "5 Years",
            verified: true,
            rating: 4.9,
            jobs: 1240
          }
        });
      } catch (error) {
        console.error('Error fetching service:', error);
        navigate('/user/home');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id, navigate]);

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
  ];

  const checkAvailability = async (timeSlot) => {
    if (!serviceData || !date) return;

    setCheckingAvailability(true);
    try {
      const dateStr = date.toISOString().split('T')[0];
      const response = await servicesAPI.checkAvailability(id, dateStr, timeSlot);
      setAvailability(prev => ({
        ...prev,
        [timeSlot]: response.available
      }));
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailability(prev => ({
        ...prev,
        [timeSlot]: true // Default to available on error
      }));
    } finally {
      setCheckingAvailability(false);
    }
  };

  useEffect(() => {
    if (selectedTime && date && serviceData) {
      checkAvailability(selectedTime);
    }
  }, [selectedTime, date, serviceData]);

  const handleBookNow = async () => {
    if (!selectedTime) {
      alert("Please select a time slot for the service.");
      return;
    }

    if (!serviceData) return;

    // Add service to cart (database)
    const cartItem = {
      service: serviceData,
      id: serviceData.id,
      serviceId: serviceData.id
    };

    await addToCart(cartItem);
    navigate('/user/cart');
  };

  const formatReviews = (reviews) => {
    if (reviews >= 1000000) return `${(reviews / 1000000).toFixed(1)}M+`;
    if (reviews >= 1000) return `${(reviews / 1000).toFixed(0)}k+`;
    return `${reviews}+`;
  };

  if (loading) {
    return (
      <div className="service-details-page">
        <UserNavbar />
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!serviceData) {
    return (
      <div className="service-details-page">
        <UserNavbar />
        <div className="error-state">
          <p>Service not found</p>
          <button onClick={() => navigate('/user/home')}>Go Back</button>
        </div>
      </div>
    );
  }

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
              <span>{serviceData.rating} ({formatReviews(serviceData.reviews)} bookings)</span>
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
                  {timeSlots.map(time => {
                    const isAvailable = availability[time] !== false;
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        className={`slot-btn ${isSelected ? 'active' : ''} ${availability[time] === false ? 'unavailable' : ''}`}
                        onClick={() => {
                          if (isAvailable) {
                            setSelectedTime(time);
                            checkAvailability(time);
                          }
                        }}
                        disabled={availability[time] === false}
                        title={availability[time] === false ? 'Slot not available' : ''}
                      >
                        {time}
                        {availability[time] === false && <span className="unavailable-badge">Booked</span>}
                      </button>
                    );
                  })}
                </div>
                {checkingAvailability && (
                  <p className="checking-availability">Checking availability...</p>
                )}
              </div>

              <div className="booking-footer">
                {selectedTime && availability[selectedTime] === false && (
                  <div className="availability-warning">
                    <FaExclamationCircle /> This time slot is not available. Please select another time.
                  </div>
                )}
                <button 
                  className="book-btn" 
                  onClick={handleBookNow}
                  disabled={!selectedTime || availability[selectedTime] === false}
                >
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
