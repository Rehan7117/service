import React, { useState } from 'react';
import UserList from '../pages/UserList';
import BookingList from '../pages/BookingList';
import AdminRegister from '../Admin/AdminRegister';
import UploadBanner from '../Admin/UploadBanner'; // Correct the import path
import './adminDashboard.css';

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState('users');

  const renderContent = () => {
    switch (activePage) {
      case 'users':
        return <UserList />;
      case 'bookings':
        return <BookingList />;
      case 'register':
        return <AdminRegister />;
      case 'upload':
        return <UploadBanner />; // Corrected to use UploadBanner
      default:
        return <UserList />;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <h2>Admin Dashboard</h2>
        <ul>
          <li
            className={activePage === 'users' ? 'active' : ''}
            onClick={() => setActivePage('users')}
          >
            Users
          </li>
          <li
            className={activePage === 'bookings' ? 'active' : ''}
            onClick={() => setActivePage('bookings')}
          >
            Bookings
          </li>
          <li
            className={activePage === 'register' ? 'active' : ''}
            onClick={() => setActivePage('register')}
          >
            Register Admin
          </li>
          <li
            className={activePage === 'upload' ? 'active' : ''}
            onClick={() => setActivePage('upload')}
          >
            Admin Upload
          </li>
        </ul>
      </div>
      <div className="content">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
