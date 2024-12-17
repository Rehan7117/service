const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  detailsName: {
    type: String,
    required: true,
  },
  serviceName: {
    type: String,
    required: true,
  },
  addressName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Banner', bannerSchema);
