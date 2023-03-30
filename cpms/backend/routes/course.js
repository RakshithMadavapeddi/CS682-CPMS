const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course');
const auth = require('../middlewares/auth');

// Get all courses
router.get('/', auth, courseController.getAllCourses);

// Get a single course
router.get('/:id', auth, courseController.getCourse);

// Create a new course
router.post('/', auth, courseController.createCourse);

// Get courses created by a professor
router.get('/professor/:id', auth, courseController.getCoursesByProfessor);

module.exports = router;
