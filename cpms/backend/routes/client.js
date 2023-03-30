const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

// Client Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('client/dashboard', {
    user: req.user
  });
});

module.exports = router;
