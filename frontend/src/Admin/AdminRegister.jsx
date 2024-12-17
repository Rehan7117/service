import React, { useState } from 'react';
import axios from 'axios';
import './adminlr.css';
const AdminRegister = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/admin/register', {
        username,
        password,
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed! Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Admin Registration</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default AdminRegister;
