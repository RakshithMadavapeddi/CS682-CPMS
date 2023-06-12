// controllers/courseController.js
const Course = require("../models/courses");
const mongoose = require("mongoose");
const Preference = require("../models/preferences");
const Project = require("../models/projects");
const User = require("../models/users");
const { sendEmail } = require("../services/sendMail");
const { minCut, createFlowNetwork } = require("../services/min_cost.js");

const getAllCourses = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user._id;
    if (role === "ADMIN") {
      const courses = await Course.find();
      return res.status(200).json(courses);
    } else if (role === "STUDENT") {
      const courses = await Course.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "users",
            foreignField: "_id",
            as: "students",
          },
        },
        {
          $match: {
            "students._id": new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
          },
        },
        {
          $addFields: {
            users: "$$REMOVE",
            maxPreferences: "$$REMOVE",
            maxStudentsPerProject: "$$REMOVE",
            assignedProject: "$$REMOVE",
          },
        },
      ]);

      return res.status(200).json(courses);
    } else {
      return res.status(401).json({ error: "Unauthorized to Access" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "internal server error" });
  }
};

const getCourseByName = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user._id;
    const courseName = req.params.name;
    if (!courseName) {
      return res.status(400).json({ error: "missing course name" });
    }

    if (role === "ADMIN") {
      const course = await Course.findOne({ name: courseName })
        .populate("users")
        .populate("projects")
        .populate("assignedProject");
      console.log(course);
      return res.status(200).json(course);
    } else if (role === "STUDENT") {
      const course = await Course.findOne({ name: courseName }).populate("projects").populate("users");

      const userExists = course.users.some(user => user._id.toString() === userId.toString());

      if (!userExists) {
        return res.status(404).json({ error: "course not found or not enrolled" });
      }

      const { _id, name, description, projects, stage, maxPreferences, maxStudentsPerProject, preferencesDeadline, createdAt } = course;
      return res.status(200).json({ _id, name, description, projects, stage, maxPreferences, maxStudentsPerProject, preferencesDeadline, createdAt });
    } else {
      return res.status(401).json({ error: "internal server error" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "internal server error" });
  }
};

const createCourse = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ error: "Name and description are required" });
    }

    const existingCourse = await Course.findOne({ name });
    if (existingCourse) {
      return res
        .status(409)
        .json({ error: "A course with this name already exists" });
    }

    const newCourse = new Course({
      name,
      description,
      users: [],
    });

    const savedCourse = await newCourse.save();
    return res.status(201).json(savedCourse);
  } catch (error) {
    return res.status(500).json({ error: "internal error" });
  }
};

const deleteCourse = async (req, res) => {
  const { _id } = req.params;

  if (!_id) {
    return res.status(400).json({ error: "course id is missing" });
  }

  const course = await Course.find({ _id: _id });
  if (!course) {
    return res.status(404).json({ error: "course not found" });
  }

  try {
    await Course.findByIdAndDelete(_id);
    return res.status(200).json({ message: "successfully deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "internal server error" });
  }
};

const addStudentToCourse = async (req, res) => {
  const { _id, name, email, password } = req.body;

  if (!_id || !name || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const course = await Course.findOne({ _id: _id }).populate("users").populate({
    path: "users",
    model: "User",
  });

  if (!course) {
    console.log(req.body);
    console.log({ course });
    return res.status(404).json({ error: "Course not found" });
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    try {
      await sendEmail(
        email,
        `Invitation to ${course.name} on CAMS`,
        name,
        email,
        password,
        3,
        course.name
      );
    } catch (err) {
      return res.status(400).json({ error: "email doesnt exist" });
    }

    const newUser = new User({
      name: name,
      email: email,
      password: password,
      role: "STUDENT",
    });
    await newUser.save();

    course.users.push(newUser._id);
    await course.save();
  } else {
    const userExists = course.users.some((u) => u.email === email);
    if (userExists) {
      return res
        .status(409)
        .json({ error: "User already registered for this course" });
    }
    course.users.push(user._id);
    await course.save();
  }

  try {
    const updatedCourse = await Course.findOne({ _id: _id }).populate("users");
    return res.status(200).json(updatedCourse);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteStudentFromCourse = async (req, res) => {
  const { courseId, studentId } = req.body;

  try {
    const course = await Course.findOneAndUpdate(
      { _id: courseId, users: { $in: [studentId] } },
      { $pull: { users: studentId } },
      { new: true }
    );

    if (course) {
      return res
        .status(200)
        .json({ message: "Student removed successfully from course" });
    } else {
      return res
        .status(404)
        .json({ error: "Cannot find the student in course" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateCourseProjects = async (req, res) => {
  const { name } = req.params;
  const { projects } = req.body;

  try {
    const course = await Course.findOneAndUpdate(
      { name },
      { $set: { projects } },
      { new: true }
    ).populate("projects");

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    return res.status(200).json(course);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const setPreferencesForCourse = async (req, res) => {
  const { name, maxPreferences, maxStudentsPerProject, preferencesDeadline } =
    req.body;

  const course = await Course.findOne({ name: name });
  if (!course) {
    return res.status(400).json({ error: "cannot find course" });
  }

  try {
    await Course.findOneAndUpdate(
      { name: name },
      {
        maxPreferences: maxPreferences,
        maxStudentsPerProject: maxStudentsPerProject,
        preferencesDeadline: preferencesDeadline,
        stage: 2,
      }
    );
    updatedCourse = await findOne({ name: name });
    return res.status(200).json(updatedCourse);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "internal error" });
  }
};

const autoAssignProjectsForACourse = async (req, res) => {
  const { projectCapacities } = req.body;
  const { name } = req.params;

  try {
    // Find the course
    const course = await Course.findOne({ name });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Get all preferences for the course
    const preferences = await Preference.find({ course: course._id });

    // Transform the data into the required format
    const students = preferences.map(p => p.student.toString());
    const studentPreferences = {};
    preferences.forEach(preference => {
      studentPreferences[preference.student.toString()] = preference.projectPreferences.map(pp => ({ project: pp.project.toString(), weight: pp.rank }));
    });

    // Create a flow network
    const graph = createFlowNetwork(students, studentPreferences, projectCapacities);

    // Find a maximum flow and the corresponding assignments
    const assignments = minCut(graph, 0, graph.length - 1, students, Object.keys(projectCapacities));

    // Update the course with the assignments
    const updatedAssignments = assignments.map(assignment => ({
      student: assignment.student,
      project: assignment.project,
    }));

    // Update the course document in the database with the new assignments and stage
    await Course.findByIdAndUpdate(course._id, {
      $push: { assignedProject: { $each: updatedAssignments } },
      $set: { stage: 3 }
    });

    // Fetch the updated course from the database
    const updatedCourse = await Course.findById(course._id).populate("users").populate('assignedProject').populate('projects');

    return res.json(updatedCourse);
  } catch (error) {
    // Handle the error, log it, and potentially send an error response
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const getTeammates = async (req, res) => {
  const { name } = req.params;
  const payload = req.user;
  const userId = payload

  try {
    // Find the course
    const course = await Course.findOne({ name })
      .populate({
        path: 'users',
        select: 'name email',
      })
      .populate({
        path: 'assignedProject',
        populate: {
          path: 'project',
          model: 'Project',
        },
      });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.stage !== 3) {
      return res.status(400).json({ message: 'Course is not in stage 3' });
    }

    // Extract relevant data
    const students = course.users;
    const assignedProjects = course.assignedProject;

    // Create an array of students with their name, email, and assigned project details
    const teammateArray = students.map(student => {
      const assignment = assignedProjects.find(assignment => assignment.student.toString() === student._id.toString());
      const project = assignment ? assignment.project : null;
      return {
        name: student.name,
        email: student.email,
        project,
      };
    });

    return res.json(teammateArray);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  createCourse,
  getTeammates,
  deleteCourse,
  updateCourseProjects,
  getCourseByName,
  getAllCourses,
  addStudentToCourse,
  deleteStudentFromCourse,
  setPreferencesForCourse,
  autoAssignProjectsForACourse
};
