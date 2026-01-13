import { useState } from "react";
import "./AddService.css";

const AddService = () => {
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("Active");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dummy submit (no backend)
    alert(
      `Service Added (Dummy)\n\nName: ${serviceName}\nPrice: ₹${price}\nStatus: ${status}`
    );

    // reset form
    setServiceName("");
    setPrice("");
    setStatus("Active");
  };

  return (
    <div className="add-service">
      <h1>Add New Service</h1>
      <p className="subtitle">Create a new service (dummy data)</p>

      <form className="add-service-form" onSubmit={handleSubmit}>
        <label>
          Service Name
          <input
            type="text"
            placeholder="e.g. AC Repair"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            required
          />
        </label>

        <label>
          Price (₹)
          <input
            type="number"
            placeholder="e.g. 499"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>

        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>

        <button type="submit">Add Service</button>
      </form>
    </div>
  );
};

export default AddService;
