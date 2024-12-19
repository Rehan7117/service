import React, { useState } from 'react'; // You only need this one import
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
// import './pages/login.css'; // Ensure the path is correct for login.css

const ServiceLogin = () => {
  const navigate = useNavigate();
  const [serviceId, setServiceId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Basic validation before making the request
    if (!serviceId || !password) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/service/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setError(''); // Clear any existing error
        localStorage.setItem('serviceToken', data.token); // Store token in localStorage
        navigate('/service-dashboard'); // Redirect to dashboard after successful login
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (error) {
      setError('Something went wrong. Please try again later.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Service Login</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Service ID"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-btn">Login</button>

        {error && <p className="error-message">{error}</p>}

        <p className="register-link">
          Don't have an account? <Link to="/service-register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default ServiceLogin;
