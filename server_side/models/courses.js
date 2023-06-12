const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  users: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }], 
    default:null,
  },

  projects:{
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    }], 
    default:[]
  },

  stage: {
    type: Number,
    default: 1,
    required: true,
  },
  
  maxPreferences: {
    type: Number,
    required: true,
    default: 3 // set a default value if none is provided
  },
  maxStudentsPerProject: {
    type: Number,
    required: true,
    default: 3 // set a default value if none is provided
  },
  preferencesDeadline: {
    type: Date,
    default: null
  },

  assignedProject: {
    type: [{
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
      }
    }],
    required: true,
    default: []
  }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
