import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

/**
 * Navbar Component
 * Renders the global navigation header for the application.
 * Dynamically displays login/signup buttons or a user profile greeting
 * and logout action depending on the current session state.
 */
const Navbar = () => {
  // Extract the current user session details and the logout action from the Zustand auth store
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });

      logout(); // Zustand logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="navbar">
      {/* Brand Logo and Custom SVG icon */}
      <div className="logo">
        <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>SkillMatch AI</span>
      </div>

      {/* Conditionally rendered links based on authentication state */}
      <div className="nav-links">
        {!user ? (
          // Authenticated = false: Show Login and Registration options
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="btn-signup">Sign Up</Link>
          </>
        ) : (
          // Authenticated = true: Show user info greeting and Log Out button
          <div className="user-profile-nav">
            <Link to="/" className="nav-link" style={{ marginRight: "1rem" }}>Dashboard</Link>
            <Link to="/new-analysis" className="nav-link" style={{ marginRight: "1.5rem" }}>+ New Match</Link>
            {/* User Avatar Circle containing the first letter of user's name */}
            <div className="user-avatar" title={user.email}>
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            {/* User Personalized Greeting */}
            <span className="user-name">Welcome, {user.name || "User"}</span>
            {/* Logout Trigger Button */}
            <button onClick={handleLogout} className="btn-logout">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
