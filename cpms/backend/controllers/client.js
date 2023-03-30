const User = require('../models/user');
const Project = require('../models/project');
const express = require('express');
const profileRouter = express.Router();

// Client Dashboard
exports.getDashboard = async (req, res) => {
    try {
      // Retrieve the authenticated user's information
      const user = await User.findById(req.user.id);
  
      // Retrieve all the projects associated with this client
      const projects = await Project.find({ client: req.user.id });
  
      res.render('client/dashboard', {
        user,
        projects
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  // Update a project
exports.updateProject = async (req, res) => {
    const { name, description } = req.body;
  
    try {
      let project = await Project.findById(req.params.id);
  
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      // Make sure the authenticated user is the client who owns the project
      if (project.client.toString() !== req.user.id) {
        return res.status(401).json({ error: 'Not authorized' });
      }
  
      project.name = name;
      project.description = description;
  
      await project.save();
  
      res.json(project);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  // Create a new project what is requireAuth?
//profileRouter.post('/projects', requireAuth, (req, res) => {
  //  profile.createProject(req, res);
  //});

module.exports = profileRouter;