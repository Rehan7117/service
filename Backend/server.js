const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Import bcrypt
const multer = require('multer');
const path = require('path');
const serviceRoutes = require('./routes/serviceRoutes');

// Load environment variables from .env file
dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clgproject', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process with failure
  }
};

connectDB(); // Connect to MongoDB

const app = express();
app.use(express.json());
app.use(cors()); // Use CORS middleware

// Import Models
const bannerRoutes = require('./routes/bannerRoutes');
const User = require('./models/User');
const Admin = require('./models/admin');
const Booking = require('./models/Booking');

// Middleware to verify if the user is an admin
const verifyAdminToken = async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Get the token from Authorization header

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token with JWT_SECRET

    // Check if the user is an admin
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    req.user = decoded; // Save the decoded token data to the request object
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error('Error verifying token:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// ----------------------------------
// User Routes
// ----------------------------------

// Register user
app.post('/api/auth/register', async (req, res) => {
  const { firstName, lastName, username, email, phone, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      firstName,
      lastName,
      username,
      email,
      phone,
      password,
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Fetch all users (for admin use)
app.get('/api/users', verifyAdminToken, async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password from response for security
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Fetch all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find(); // Retrieve all bookings
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// Create a booking
app.post('/api/bookings', async (req, res) => {
  const { username, email, pickupLocation, pickupPhone, dropLocation, dropPhone, goodsType, weight, date, price } = req.body;

  try {
    // Find the number of bookings for the given date
    const bookingsOnDate = await Booking.find({ date: new Date(date) }).countDocuments();

    // Check if the limit of 10 bookings has been reached
    if (bookingsOnDate >= 3) {
      return res.status(400).json({ message: 'No more bookings available for this date. Please choose another date.' });
    }

    // If less than 10 bookings, create the booking
    const booking = new Booking({
      username,
      email,
      pickupLocation,
      pickupPhone,
      dropLocation,
      dropPhone,
      goodsType,
      weight,
      date,
      price,
    });

    await booking.save();
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    console.error('Error creating booking:', error.message);
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
});

// Admin Registration Route
app.post('/api/admin/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Error registering admin:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin Login Route
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id, isAdmin: true }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ message: 'Login successful', token, admin });
  } catch (error) {
    console.error('Error logging in admin:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.use('/api', bannerRoutes);
app.use('/bannerfolder', express.static(path.join(__dirname, 'bannerfolder')));

app.use('/api', serviceRoutes);


// Start the Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
