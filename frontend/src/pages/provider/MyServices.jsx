import { useEffect, useState } from "react";
import "./MyServices.css";

const MyServices = () => {
  const [myServices, setMyServices] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/services")
      .then((res) => res.json())
      .then((data) => {
        // TEMP: filter by provider_id
        const filtered = data.filter(
          (service) => service.provider_id === 2
        );
        setMyServices(filtered);
      })
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

  return (
    <div className="my-services">
      <h1>My Services</h1>
      <p className="subtitle">List of services you provide</p>

      {myServices.length === 0 && <p>No services added yet.</p>}

      <table className="services-table">
        <thead>
          <tr>
            <th>Service Name</th>
            <th>Price (₹)</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {myServices.map((service) => (
            <tr key={service.id}>
              <td>{service.title}</td>
              <td>{service.price}</td>
              <td>
                <span className="status active">Active</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyServices;
