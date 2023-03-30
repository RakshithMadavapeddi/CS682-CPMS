const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profile');
const auth = require('../routes/auth');


// Get user profile
router.get('/', auth, getProfile);

// Update user profile
router.put('/', auth, updateProfile);

module.exports = router;