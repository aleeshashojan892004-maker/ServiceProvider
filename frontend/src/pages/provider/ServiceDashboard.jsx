import { useEffect, useState } from "react";
import "./ServiceDashboard.css";

const ServiceDashboard = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/services")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched services:", data); // debug
        setServices(data);
      })
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

  return (
    <div className="provider-dashboard">
      <h1>Service Provider Dashboard</h1>
      <p className="subtitle">Overview of your services and bookings.</p>

      <div className="service-card-container">
        {services.length === 0 && <p>No services added yet.</p>}

        {services.map((service) => (
          <div key={service.id} className="service-card">
            {/* Static image for now */}
            <img
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952"
              alt={service.title}
            />

            <div className="card-content">
              <h4>{service.title}</h4>
              <p className="price">₹{service.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceDashboard;
