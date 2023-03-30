const express = require('express');
const router = express.Router();
const { getStudentDashboard } = require('../controllers/student');

// Route to get the student dashboard
router.get('/dashboard', getStudentDashboard);

module.exports = router;