import { NavLink } from "react-router-dom";
import "./ProviderSidebar.css";

const ProviderSidebar = () => {
  return (
    <div className="sidebar">
      <h2>Service Panel</h2>

      <NavLink to="/" end>
        Dashboard
      </NavLink>

      <NavLink to="/my-services">
        My Services
      </NavLink>

      <NavLink to="/add-service">
        Add Service
      </NavLink>

      <NavLink to="/bookings">
        Bookings
      </NavLink>
    </div>
  );
};

export default ProviderSidebar;
