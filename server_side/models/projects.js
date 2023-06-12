const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true
  },
  fileUrl: { 
    type: String, 
    required: true 
  },
  administrators: {
    type: String, 
    required: true
  },
  deadline: {
    type: Date, 
    required: true
  },
  skills: {
    type: String, 
    required: true
  },
  resources: {
    type: String, 
    required: true
  },
  createdBy: {
    type: String, 
    required: true
  },
  pending: {
    type: Boolean,
    required: true
  }

},{timestamps:true});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
