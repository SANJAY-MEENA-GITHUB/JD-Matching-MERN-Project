import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

/**
 * Signup Component
 * Renders the user registration form. Takes input details (Full Name, Email, Password),
 * posts them to the backend api/auth/register endpoint, and routes to login on success.
 */
function Signup() {
  // Local state hook for signup inputs
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  /**
   * Handles submission of registration inputs
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send post request to register API
      // const res = await fetch("http://localhost:5000/api/auth/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(form)
      // });
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        // Successful registration: alert user and navigate to Sign In page
        alert("Signup successful! Please login.");
        navigate("/login");
      } else {
        // Handle server/model level registration failures
        alert(data.error || "Signup failed");
      }
    } catch (err) {
      alert("Network error. Try again.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2>Create Account</h2>
        <p className="subtitle">Join us today to get started</p>

        <form onSubmit={handleSubmit}>
          {/* Full Name Input Field */}
          <div className="signup-group">
            <label>Full Name</label>
            {/* <input
              className="signup-input"
              type="text"
              placeholder="John Doe"
              required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            /> */}
            <input
              className="signup-input"
              type="text"
              placeholder="John Doe"
              required
              value={form.name} // ✨ Add this
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Email Input Field */}
          <div className="signup-group">
            <label>Email Address</label>
            {/* <input
              className="signup-input"
              type="email"
              placeholder="john@example.com"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            /> */}
            <input
              className="signup-input"
              type="email"
              placeholder="john@example.com"
              required
              value={form.email} // ✨ Add this
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Password Input Field */}
          <div className="signup-group">
            <label>Password</label>
            {/* <input
              className="signup-input"
              type="password"
              placeholder="Create a password"
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            /> */}
            <input
              className="signup-input"
              type="password"
              placeholder="Create a password"
              required
              value={form.password} // ✨ Add this
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {/* Registration Submit Button */}
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>

        {/* Link back to Login page */}
        <div className="signup-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;