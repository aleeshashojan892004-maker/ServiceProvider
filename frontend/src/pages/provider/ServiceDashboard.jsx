import "./ServiceDashboard.css";

const services = [
  {
      id: 1,
      name: "AC Repair",
      price: "₹499",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
    },

  {
    id: 2,
    name: "Bathroom Cleaning",
    price: 799,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600",
  },
  {
    id: 3,
    name: "Electrician",
    price: 299,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
  },
];

const ServiceDashboard = () => {
  return (
    <div className="provider-dashboard">
      <h1>Service Provider Dashboard</h1>
      <p className="subtitle">Overview of your services and bookings.</p>

      <div className="service-card-container">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <img src={service.image} alt={service.name} />

            <div className="card-content">
              <h4>{service.name}</h4>
              <p className="price">₹{service.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceDashboard;
