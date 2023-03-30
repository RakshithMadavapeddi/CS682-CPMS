const Project = require('../models/Project');

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { title, description, admin, skills, deadline, resources } = req.body;
    const file = req.file;

    if (!file || file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Please upload a PDF file' });
    }

    if (file.size > 25000000) {
      return res.status(400).json({ error: 'File size should not exceed 25MB' });
    }

    const project = await Project.create({
      title,
      description,
      admin,
      skills,
      deadline,
      resources,
      file: {
        data: file.buffer,
        contentType: file.mimetype
      },
      creator: req.user.id
    });

    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all published projects
exports.getPublishedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ isPublished: true });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Publish a project
exports.publishProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    project.isPublished = true;
    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Middleware to authenticate client
exports.authenticateClient = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'You must be logged in as a client to access this resource' });
  }
  if (req.user.role !== 'client') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

// Update a project
exports.updateProject = async (req, res) => {
    try {
      const projectId = req.params.id;
      const { title, description, admin, skills, deadline, resources } = req.body;
      const file = req.file;
  
      const project = await Project.findById(projectId);
  
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      // Check if the authenticated user is the owner of the project
      if (project.creator.toString() !== req.user.id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      // Update project fields
      project.title = title;
      project.description = description;
      project.admin = admin;
      project.skills = skills;
      project.deadline = deadline;
      project.resources = resources;
  
      // Check if a new file was uploaded
      if (file) {
        if (file.mimetype !== 'application/pdf') {
          return res.status(400).json({ error: 'Please upload a PDF file' });
        }
  
        if (file.size > 25000000) {
          return res.status(400).json({ error: 'File size should not exceed 25MB' });
        }
  
        project.file = {
          data: file.buffer,
          contentType: file.mimetype
        };
      }
  
      await project.save();
  
      res.json(project);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  // Delete a project
  exports.deleteProject = async (req, res) => {
    try {
      const projectId = req.params.id;
  
      const project = await Project.findById(projectId);
  
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      // Check if the authenticated user is the owner of the project
      if (project.creator.toString() !== req.user.id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      await project.remove();
  
      res.json({ message: 'Project deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };