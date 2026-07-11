import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "./Login.css";

/**
 * Login Component
 * Renders the sign-in portal. Users enter their registered credentials,
 * which are validated against the backend authorization endpoint.
 * Saves the session info to Zustand store and updates local storage.
 */
// function Login() {
//   // Local state representing form inputs
//   const [form, setForm] = useState({ email: "", password: "" });

//   // Extract the login function from Zustand store
//   const login = useAuthStore((state) => state.login);
//   const navigate = useNavigate();

//   /**
//    * Handles sign-in form dispatching
//    */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Send credentials payload to login API
//       // const res = await fetch("http://localhost:5000/api/auth/login", {
//       //   method: "POST",
//       //   headers: { "Content-Type": "application/json" },
//       //   body: JSON.stringify(form)
//       // });
//       const res = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(form)
//       });

//       const data = await res.json();

//       if (res.ok) {
//         // Successful match: store session details and redirect to dashboard
//         login(data.user);
//         navigate("/");
//       } else {
//         // Show validation or user check messages
//         alert(data.error || "Login failed");
//       }
//     } catch (err) {
//       alert("Server error. Please try again later.");
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-card">
//         <h2>Welcome Back</h2>
//         <p>Enter your details to stay connected</p>

//         <form onSubmit={handleSubmit}>
//           {/* Email Form Field */}
//           <div className="form-group">
//             <label>Email Address</label>
//             <input
//               className="form-input"
//               type="email"
//               placeholder="name@example.com"
//               required
//               onChange={(e) => setForm({ ...form, email: e.target.value })}
//             />
//           </div>

//           {/* Password Form Field */}
//           <div className="form-group">
//             <label>Password</label>
//             <input
//               className="form-input"
//               type="password"
//               placeholder="••••••••"
//               required
//               onChange={(e) => setForm({ ...form, password: e.target.value })}
//             />
//           </div>

//           {/* Form Submit Button */}
//           <button type="submit" className="login-btn">Sign In</button>
//         </form>

//         {/* Navigation back to registration page */}
//         <div className="login-footer">
//           Don't have an account? <Link to="/signup">Create one</Link>
//         </div>
//       </div>
//     </div>
//   );
// }

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user);

        // ✨ Clear the local form state right before navigating away
        setForm({ email: "", password: "" });

        navigate("/");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p>Enter your details to stay connected</p>

        <form onSubmit={handleSubmit} autocomplete="off"> {/* ← Added autocomplete protection */}
          <div className="form-group">
            <label>Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="name@example.com"
              required
              value={form.email} // ✨ Bind value to state
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              required
              value={form.password} // ✨ Bind value to state
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button type="submit" className="login-btn">Sign In</button>
        </form>

        <div className="login-footer">
          Don't have an account? <Link to="/signup">Create one</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;



