import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const isAdmin = !!localStorage.getItem("adminToken");

  function logout() {
    localStorage.removeItem("adminToken");
    navigate("/");
  }

  return (
    <div className="navbar">
      <Link to="/"><h1>📊 CDL result</h1></Link>
      <div className="nav-links">
        {isAdmin ? (
          <>
            <Link to="/admin/dashboard">Admin Dashboard</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/admin/login">Admin Login</Link>
        )}
      </div>
    </div>
  );
}
