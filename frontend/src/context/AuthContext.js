import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State for regular user
  const [admin, setAdmin] = useState(null); // State for admin
  const [service, setService] = useState(null); // State for service provider
  const [loading, setLoading] = useState(true); // State for loading during token verification

  // Function to load user, admin, and service from token when the app initializes
  const loadUserFromToken = async () => {
    const userToken = localStorage.getItem('token'); // For regular user
    const adminToken = localStorage.getItem('adminToken'); // For admin
    const serviceToken = localStorage.getItem('serviceToken'); // For service provider

    try {
      if (adminToken) {
        const response = await axios.get('http://localhost:3001/api/admin/me', {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
        setAdmin(response.data.admin); // Set admin data
      } else if (userToken) {
        const response = await axios.get('http://localhost:3001/api/auth/me', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setUser(response.data.user); // Set user data
      } else if (serviceToken) {
        const response = await axios.get('http://localhost:3001/api/service/me', {
          headers: {
            Authorization: `Bearer ${serviceToken}`,
          },
        });
        setService(response.data.service); // Set service data
      }
    } catch (error) {
      console.error('Error loading user, admin, or service from token:', error);
      // Clear invalid tokens
      localStorage.removeItem('adminToken');
      localStorage.removeItem('token');
      localStorage.removeItem('serviceToken');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserFromToken();
  }, []);

  // Regular user registration function
  const register = async (firstName, lastName, username, email, phone, password) => {
    try {
      await axios.post('http://localhost:3001/api/auth/register', {
        firstName,
        lastName,
        username,
        email,
        phone,
        password,
      });
      alert('Registration successful! Please log in.');
    } catch (error) {
      console.error('User registration failed:', error);
      alert('Registration failed! Please try again.');
    }
  };

  // Regular user login function
  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        username,
        password,
      });
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      alert('Login successful!');
    } catch (error) {
      console.error('User login failed:', error);
      alert('Login failed! Please check your credentials.');
    }
  };

  // Admin registration function
  const adminRegister = async (username, password) => {
    try {
      await axios.post('http://localhost:3001/api/admin/register', { username, password });
      alert('Admin registration successful! Please log in.');
    } catch (error) {
      console.error('Admin registration failed:', error);
      alert('Admin registration failed! Please try again.');
    }
  };

  // Admin login function
  const adminLogin = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3001/api/admin/login', { username, password });
      setAdmin(response.data.admin);
      localStorage.setItem('adminToken', response.data.token);
      alert('Admin login successful!');
    } catch (error) {
      console.error('Admin login failed:', error);
      alert('Admin login failed! Please check your credentials.');
    }
  };

  // Service provider registration function
  const serviceRegister = async (serviceId, serviceName, password) => {
    try {
      const response = await axios.post('http://localhost:3001/api/service/register', {
        serviceId,
        serviceName,
        password,
      });

      if (response.status === 201) {
        alert('Service registered successfully!');
        window.location.href = '/service-login'; // Redirect after successful registration
      }
    } catch (error) {
      console.error('Service registration failed:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message || 'Service registration failed');
      } else {
        alert('Service registration failed, please try again later.');
      }
    }
  };

  // Service provider login function
  const serviceLogin = (serviceData) => {
    setService(serviceData); // Set the service provider in context
    localStorage.setItem('serviceToken', serviceData.token); // Optionally save token in localStorage
  };

  // Service provider logout
  const serviceLogout = () => {
    setService(null);  // Clear the service from context
    localStorage.removeItem('serviceToken'); // Optionally remove the service token from localStorage
  };

  // Logout function for regular user and admin
  const logout = () => {
    setUser(null);
    setAdmin(null);
    setService(null);
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('serviceToken');
  };

  const value = {
    user,
    admin,
    service,
    register,
    login,
    adminRegister,
    adminLogin,
    serviceRegister,
    serviceLogin,
    serviceLogout,
    logout,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
