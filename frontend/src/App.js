// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './pages/Navbar';
import Footer from './pages/Footer';

// General Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import AboutUs from './pages/Aboutus';
import History from './pages/History';

// Admin Pages
import AdminDashboard from './Admin/AdminDashboard';
import AdminLogin from './Admin/AdminLogin';
import AdminRegister from './Admin/AdminRegister';
import UploadBanner from './Admin/UploadBanner'; // Correct import path for AdminUpload
import ProtectedRoute from './Admin/ProtectedRoute'; // Import the ProtectedRoute component

// Other Pages
import DualLoginPage from './pages/DualLoginPage';
import ServiceLogin from './pages/service/ServiceLogin'; // Import ServiceLogin page
import UserList from './pages/UserList';
import BookingList from './pages/BookingList';
import ServiceRegister from './pages/service/ServiceRegister'; // Import ServiceRegister page
import ServiceDashboard from './pages/service/ServiceDashboard'; // Import ServiceDashboard page

// Wrapping the app with AuthProvider for authentication context
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        
        {/* Routes for different paths */}
        <Routes>
          {/* Root Route now directly goes to DualLoginPage */}
          <Route path="/" element={<DualLoginPage />} />

          {/* General Pages */}
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/history" element={<History />} />

          {/* Admin Authentication */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-register" element={<AdminRegister />} />

          {/* Protected Routes for Admin */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Upload - Protected Route */}
          <Route
            path="/admin-upload"
            element={
              <ProtectedRoute>
                <UploadBanner />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes for User and Booking */}
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookinglist"
            element={
              <ProtectedRoute>
                <BookingList />
              </ProtectedRoute>
            }
          />

          {/* Service Pages */}
          <Route path="/service-login" element={<ServiceLogin />} />
          <Route path="/service-register" element={<ServiceRegister />} />
          <Route path="/service-dashboard" element={<ServiceDashboard />} /> {/* Add ServiceDashboard route */}

        </Routes>

        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
