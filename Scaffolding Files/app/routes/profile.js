const express = require('express');
const router = express.Router();

// Profile page
router.get('/profile', (req, res) => {
  res.render('profile');
});

// Settings page
router.get('/settings', (req, res) => {
  res.render('settings');
});

module.exports = router;