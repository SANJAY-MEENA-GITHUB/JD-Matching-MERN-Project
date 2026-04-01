const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">SkillMatch</div>

      <div className="nav-links">
        <a href="#">History</a>
        <a href="#">Saved Matches</a>
        <a href="#" className="btn-profile">Profile</a>
        <div className="user-avatar"></div>
      </div>
    </nav>
  );
};

export default Navbar;
