const express = require('express');
const router = express.Router();
const { getProfessorDashboard, createCourse, manageProjects } = require('../controllers/professor');

// Route to get the professor dashboard
router.get('/dashboard', getProfessorDashboard);

// Route to create a new course
router.post('/courses', createCourse);

// Route to manage projects
router.get('/projects', manageProjects);

module.exports = router;

