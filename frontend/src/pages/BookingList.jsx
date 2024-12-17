import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Invoice from './Invoice'; // Assuming the Invoice component is in the same directory
import './bookinglist.css'; // Ensure this file exists and is properly styled

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleBookings, setVisibleBookings] = useState({}); // State to track visibility of user bookings

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/bookings');
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Toggle visibility of bookings for a specific user
  const toggleBookingsVisibility = (username) => {
    setVisibleBookings((prev) => ({
      ...prev,
      [username]: !prev[username],
    }));
  };

  return (
    <div className="booking-list-container">
      <h2>All Bookings</h2>
      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <table className="booking-list-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Actions</th>
              <th>Bookings</th>
            </tr>
          </thead>
          <tbody>
            {/* Group bookings by username */}
            {Object.entries(
              bookings.reduce((acc, booking) => {
                if (!acc[booking.username]) {
                  acc[booking.username] = [];
                }
                acc[booking.username].push(booking);
                return acc;
              }, {})
            ).map(([username, userBookings]) => (
              <React.Fragment key={username}>
                <tr>
                  <td>{username}</td>
                  <td>
                    <button onClick={() => toggleBookingsVisibility(username)}>
                      {visibleBookings[username] ? 'Hide Bookings' : 'Show Bookings'}
                    </button>
                  </td>
                  <td>
                    {visibleBookings[username] && (
                      <table className="nested-booking-table">
                        <thead>
                          <tr>
                            <th>Booking ID</th> {/* Added Booking ID Column */}
                            <th>Email</th>
                            <th>Pickup Location</th>
                            <th>Pickup Phone</th>
                            <th>Drop Location</th>
                            <th>Drop Phone</th>
                            <th>Date</th>
                            <th>Price</th>
                            <th>Invoice</th> {/* Invoice generation column */}
                          </tr>
                        </thead>
                        <tbody>
                          {userBookings.map((booking) => (
                            <tr key={booking._id}>
                              <td>{booking._id}</td> {/* Displaying Booking ID */}
                              <td>{booking.email}</td>
                              <td>{booking.pickupLocation}</td>
                              <td>{booking.pickupPhone}</td>
                              <td>{booking.dropLocation}</td>
                              <td>{booking.dropPhone}</td>
                              <td>{new Date(booking.date).toLocaleDateString()}</td>
                              <td>₹{booking.price}</td>
                              <td>
                                <Invoice bookingData={booking} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingList;
