const Course = require('../models/course');
const Project = require('../models/project');

// Get the professor dashboard
exports.getProfessorDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all courses that the professor has created
    const courses = await Course.find({ professor: userId });

    // Find all projects that the professor has created
    const projects = await Project.find({ creator: userId });

    res.render('professor/dashboard', {
      courses,
      projects,
      user: req.user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Create a new course with the professor as the creator
    const course = new Course({
      title,
      description,
      professor: req.user.id,
      students: [],
    });

    await course.save();

    res.redirect('/professor/dashboard');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { title, description, admins, skills, deadline, resources } = req.body;
    const creator = req.user.id;

    // Create a new project with the professor as the creator
    const project = new Project({
      title,
      description,
      admins,
      skills,
      deadline,
      resources,
      creator,
      file: req.file.buffer,
      fileType: req.file.mimetype,
    });

    await project.save();

    res.redirect('/professor/dashboard');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Edit a project
exports.editProject = async (req, res) => {
  try {
    const { title, description, admins, skills, deadline, resources } = req.body;

    const project = await Project.findById(req.params.id);

    // Update the project fields
    project.title = title;
    project.description = description;
    project.admins = admins;
    project.skills = skills;
    project.deadline = deadline;
    project.resources = resources;

    await project.save();

    res.redirect('/professor/dashboard');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);

    res.redirect('/professor/dashboard');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};