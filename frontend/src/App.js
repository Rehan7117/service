import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './pages/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './pages/Footer';
import UserList from './pages/UserList';
import Contact from './pages/Contact';
import BookingList from './pages/BookingList';
import AdminDashboard from './Admin/AdminDashboard';
import AdminLogin from './Admin/AdminLogin';
import AdminRegister from './Admin/AdminRegister';
import ProtectedRoute from './Admin/ProtectedRoute'; // Import the ProtectedRoute component
import AboutUs from './pages/Aboutus';
import History from './pages/History'; // Import the History component
import UploadBanner from './Admin/UploadBanner'; // Corrected the import path for AdminUpload

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Redirect root to home */}
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/history" element={<History />} />

          {/* Admin Authentication */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-register" element={<AdminRegister />} />

          {/* Protected User and Booking Routes */}
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

          {/* Admin Dashboard */}
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
                <UploadBanner /> {/* Corrected to use UploadBanner */}
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
