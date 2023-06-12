const express = require('express');
const router = express.Router();
const courseController = require("../controllers/courseController");
const adminAuthentication = require("../middleware/adminAuthentication");
const authenticationMiddleware = require('../middleware/authentication');

router.get('/courses', authenticationMiddleware, courseController.getAllCourses);

router.get('/courses/:name', authenticationMiddleware, courseController.getCourseByName);

router.post('/course', adminAuthentication, courseController.createCourse);

router.get('/courses/teamates/:name', authenticationMiddleware ,courseController.getTeammates);

router.post('/course/student', adminAuthentication, courseController.addStudentToCourse);

router.delete('/course/:_id', adminAuthentication, courseController.deleteCourse);

router.delete('/courses/student', adminAuthentication, courseController.deleteStudentFromCourse);

router.put('/courses/:name', adminAuthentication, courseController.updateCourseProjects);

router.post('/courses/assign', adminAuthentication, courseController.setPreferencesForCourse);

router.post('/courses/assign/:name', adminAuthentication, courseController.autoAssignProjectsForACourse);
module.exports = router;