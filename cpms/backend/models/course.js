const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  session: {
    type: String,
    required: true,
    enum: ['fall', 'spring', 'winter', 'summer']
  },
  year: {
    type: Number,
    required: true,
    min: 2022,
    max: 2030
  },
  description: {
    type: String,
    required: true
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;