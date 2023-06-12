const express = require('express');
const router = express.Router();
const studentAuthentication = require("../middleware/studentAuthentication");

const preferenceController = require("../controllers/preferrenceController");

router.get('/preference/:courseId', preferenceController.getPreferencesByCourse);

router.put('/preference' , studentAuthentication ,preferenceController.updatePreference);

module.exports = router;