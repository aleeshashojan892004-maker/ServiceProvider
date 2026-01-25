import { useState } from "react";
import "./Login.css";

function Login({ switchToRegister }) {
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email,
      password,
      role,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.detail || "Login failed");
        return;
      }

      setMessage("Login successful 🎉");
      // later: save token / redirect
    } catch (err) {
      console.error("Login error:", err);
      setMessage("Server error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="title">Welcome Back</h2>
        <p className="subtitle">
          Login as a {role === "user" ? "User" : "Service Provider"}
        </p>

        {/* Role Selection */}
        <div className="role-selection">
          <label>
            <input
              type="radio"
              name="role"
              value="user"
              checked={role === "user"}
              onChange={() => setRole("user")}
            />
            User
          </label>

          <label>
            <input
              type="radio"
              name="role"
              value="provider"
              checked={role === "provider"}
              onChange={() => setRole("provider")}
            />
            Service Provider
          </label>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="submit-btn" type="submit">
            Login
          </button>
        </form>

        {message && <p className="message">{message}</p>}

        <p className="switch-text">
          Don’t have an account?{" "}
          <button className="link-btn" onClick={switchToRegister}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
