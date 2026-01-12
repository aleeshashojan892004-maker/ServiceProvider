import { useState } from "react";
import "./Registration.css";

function Registration({ switchToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    serviceName: "",
    role: "user",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Frontend validation
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    // Payload sent to backend
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.role === "provider" ? formData.phone : null,
      service_name:
        formData.role === "provider" ? formData.serviceName : null,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Registration failed");
        return;
      }

      setMessage("Registration successful 🎉");
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Server error");
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h2 className="title">Create Your Account</h2>
        <p className="subtitle">
          Register as a{" "}
          {formData.role === "user" ? "User" : "Service Provider"}
        </p>

        {/* Role Selection */}
        <div className="role-selection">
          <label>
            <input
              type="radio"
              name="role"
              value="user"
              checked={formData.role === "user"}
              onChange={handleChange}
            />
            User
          </label>

          <label>
            <input
              type="radio"
              name="role"
              value="provider"
              checked={formData.role === "provider"}
              onChange={handleChange}
            />
            Service Provider
          </label>
        </div>

        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Provider-only fields */}
          {formData.role === "provider" && (
            <>
              <div className="input-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Service Name</label>
                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Register
          </button>
        </form>

        {message && <p className="message">{message}</p>}

        <p className="switch-text">
          Already have an account?{" "}
          <button className="link-btn" onClick={switchToLogin}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Registration;
