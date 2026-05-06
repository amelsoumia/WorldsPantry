// Profile Routes
// Responsible for: Emmanuel Onyenekwe

const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const SavedRecipe = require('../models/SavedRecipe');
const db = require('../services/db');

// GET /profile
router.get('/', async (req, res) => {

    try {

        // Fetches the user's profile using session user_id if logged in
        if (!req.session.user) {

            return res.redirect('/auth/signin');
        }

        const user_id = req.session.user.user_id;

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

// GET /profile/settings
router.get('/settings', (req, res) => {

    if (!req.session.user) {
        return res.redirect('/auth/signin');
    }

    res.render('settings');
});

module.exports = router;
