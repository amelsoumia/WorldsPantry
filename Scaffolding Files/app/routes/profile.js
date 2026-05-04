// Profile Routes
// Responsible for: Emmanuel Onyenekwe

const express = require('express');
const router = express.Router();
const { Recipe } = require('../models/Recipe');
const { SavedRecipe } = require('../models/SavedRecipe');
const db = require('../services/db');

// GET /profile
router.get('/profile', async (req, res) => {
  try {
    // TODO: replace hardcoded user_id with req.session.user.user_id once auth is wired
    const user_id = 1;

    // Fetch user info
    const userRows = await db.query(
      'SELECT user_id, username, join_date FROM `user` WHERE user_id = ?',
      [user_id]
    );

    if (userRows.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = userRows[0];

    // Fetch recipes this user created
    const createdRecipes = await Recipe.getByUser(user_id);

    // Fetch recipes this user saved
    const savedRecipes = await SavedRecipe.getByUser(user_id);

    res.render('profile', {
      profileUser: user,
      createdRecipes,
      savedRecipes,
    });

  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).send('Something went wrong loading the profile page.');
  }
});

// GET /settings
router.get('/settings', (req, res) => {
  res.render('settings');
});

module.exports = router;
