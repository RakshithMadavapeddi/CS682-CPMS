const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectPreferences: {
    type: [{
      project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
      },
      rank: {
        type: Number,
        required: true
      }
    }],
    default: []
  }
}, { timestamps: true });

const Preference = mongoose.model('Preference', preferenceSchema);

module.exports = Preference;
