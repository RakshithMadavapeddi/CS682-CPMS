const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  contactEmail: {
    type: String,
    required: true
  },
  // other settings fields here
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;

