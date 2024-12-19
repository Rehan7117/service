import React from "react";
import { useNavigate } from "react-router-dom";

const DualLoginPage = () => {
  const navigate = useNavigate();

  // Handle User Login Button Click
  const handleUserLogin = () => {
    navigate("/login"); // Navigate to user login page
  };

  // Handle Service Login Button Click
  const handleServiceLogin = () => {
    navigate("/service-login"); // Navigate to service login page
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Choose Login Option</h1>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={handleUserLogin}>
          User Login
        </button>
        <button style={styles.button} onClick={handleServiceLogin}>
          Service Login
        </button>
      </div>
    </div>
  );
};

// Inline styles for the page
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f9f9f9",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#333",
  },
  buttonContainer: {
    display: "flex",
    gap: "20px",
  },
  button: {
    padding: "15px 30px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#4CAF50",
    color: "#fff",
    transition: "background-color 0.3s ease",
  },
};

export default DualLoginPage;
