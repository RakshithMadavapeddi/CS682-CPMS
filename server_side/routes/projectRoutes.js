const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const projectAuthenticationMiddleware = require('../middleware/projectAuthentication');
const adminAuthentication = require("../middleware/adminAuthentication");

// create project only by admin or client
router.post('/project', projectAuthenticationMiddleware, projectController.createProject);

router.get('/project', projectAuthenticationMiddleware, projectController.getProjectsCreatedByClient);
// get all projects only for admin,
router.get('/projects', projectAuthenticationMiddleware, projectController.getProjects);
//get project pdf through download,
router.get('/project/:_id', projectController.getProjectPdf);
// delete project pdf.
router.delete('/project/:_id', projectAuthenticationMiddleware, projectController.deleteProject);
// approve a project.
router.put('/project/:_id', adminAuthentication, projectController.approveProject);

module.exports = router;