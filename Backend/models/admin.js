// models/admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the Admin schema
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Method to compare password
adminSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Create and export the Admin model
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;