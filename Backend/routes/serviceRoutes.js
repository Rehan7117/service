const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Service = require('../models/Service'); // Import the Service model
const router = express.Router();

// Register Service Provider
router.post('/service/register', async (req, res) => {
  const { serviceId, serviceName, email, phone, password } = req.body;

  try {
    // Check if the service already exists
    const existingService = await Service.findOne({ serviceId });

    if (existingService) {
      return res.status(400).json({ message: 'Service provider already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new service provider
    const service = new Service({
      serviceId,
      serviceName,
      email,
      phone,
      password: hashedPassword, // Store the hashed password
    });

    await service.save();

    // Send a success response
    res.status(201).json({ message: 'Service provider registered successfully', service });
  } catch (error) {
    console.error('Error registering service provider:', error.message);
    res.status(500).json({ message: 'Error registering service provider', error: error.message });
  }
});

// Login Service Provider
router.post('/service/login', async (req, res) => {
  const { serviceId, password } = req.body;

  try {
    const service = await Service.findOne({ serviceId });

    if (!service || !(await bcrypt.compare(password, service.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: service._id, isService: true }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ message: 'Login successful', token, service });
  } catch (error) {
    console.error('Error logging in service provider:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
