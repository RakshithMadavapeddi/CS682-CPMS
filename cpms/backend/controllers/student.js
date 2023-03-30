const Course = require('../models/course');
const Project = require('../models/project');

// Get the student dashboard
exports.getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all courses that the student is enrolled in
    const courses = await Course.find({ students: userId });

    // Find all projects that the student is enrolled in
    const projects = await Project.find({ students: userId });

    res.render('student/dashboard', {
      courses,
      projects,
      user: req.user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
