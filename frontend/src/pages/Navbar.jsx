import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './navbar.css';

const Navbar = () => {
  const { user, logout, service, serviceLogout } = useAuth(); // Get user and service logout functions from AuthContext
  const navigate = useNavigate();

  // Handle logout for regular user
  const handleLogout = () => {
    logout(); // Logout for regular user
    navigate('/'); // Redirect to login page after logout
  };

  // Handle logout for service provider
  const handleServiceLogout = () => {
    serviceLogout(); // Logout for service provider
    navigate('/'); // Redirect to login page after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Render links for normal users if no service provider is logged in */}
        {user && !service && (
          <>
            <Link to="/home" className="navbar-link">Home</Link>
            {user.isAdmin && (
              <Link to="/admin-dashboard" className="navbar-link">Admin Dashboard</Link>
            )}
            <Link to="/contact" className="navbar-link">Contact</Link>
            <Link to="/about" className="navbar-link">About Us</Link>
            <Link to="/history" className="navbar-link">Booking History</Link>
          </>
        )}

        {/* Render links for service provider if logged in */}
        {service && (
          <>
            <Link to="/service-dashboard" className="navbar-link">Service Dashboard</Link>
          </>
        )}
      </div>

      <div className="navbar-center">
        <h1 className="navbar-heading">Transportation Service</h1>
      </div>

      <div className="navbar-right">
        {/* Conditionally render logout button if a user is logged in */}
        {user && !service ? (
          <>
            <span className="navbar-welcome">
              Hello, {user?.username}
            </span>
            <button onClick={handleLogout} className="navbar-link logout-button">
              Logout
            </button>
          </>
        ) : null}

        {/* Conditionally render Service Logout button if service provider is logged in */}
        {service &&  (
          <>
            <span className="navbar-welcome">
              Hello, {service?.serviceId} {/* Displaying serviceId instead of service.name */}
            </span>
            <button onClick={handleServiceLogout} className="navbar-link logout-button">
              Service Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
