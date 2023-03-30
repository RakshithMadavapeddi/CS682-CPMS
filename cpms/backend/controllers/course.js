const Course = require('../models/Course');

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.render('student/courses', { courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a single course
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('professor', 'name')
      .populate('students', 'name')
      .populate('projects', 'name');
    res.render('student/course', { course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { name, session, year, description } = req.body;

    const course = await Course.create({
      name,
      session,
      year,
      description,
      professor: req.user.id
    });

    res.status(201).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get courses created by a professor
exports.getCoursesByProfessor = async (req, res) => {
  try {
    const courses = await Course.find({ professor: req.params.id });
    res.render('professor/courses', { courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


