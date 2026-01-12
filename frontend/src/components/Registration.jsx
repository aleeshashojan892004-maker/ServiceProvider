import { useState } from "react";
import "./Registration.css";

function Registration({ switchToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit reached");
    console.log("Payload being sent:", formData);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

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
        <h2 className="title">Create Account</h2>
        <p className="subtitle">Register to continue</p>

        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
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
