const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project');
const { ensureAuthenticated } = require('../middleware/auth');

// Create a new project
router.post('/', ensureAuthenticated, projectController.createProject);

// Edit a project
router.put('/:id', ensureAuthenticated, projectController.editProject);

// Delete a project
router.delete('/:id', ensureAuthenticated, projectController.deleteProject);

// Get all published projects
router.get('/', projectController.getPublishedProjects);

// Publish a project
router.patch('/:id/publish', ensureAuthenticated, projectController.publishProject);

module.exports = router;