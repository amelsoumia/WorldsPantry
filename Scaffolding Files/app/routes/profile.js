// Profile Routes
// Responsible for: Emmanuel Onyenekwe

const bcrypt = require('bcryptjs');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const SavedRecipe = require('../models/SavedRecipe');
const UserRepository = require('../models/UserRepository');
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
router.get('/settings', async (req, res) => {

    try {

        if (!req.session.user) {

            return res.redirect('/auth/signin');
        }

        const userId = req.session.user.user_id;

        const profile = await UserRepository.getUserProfileByUserID(userId);
        const countries = await Category.getAll();
        const dietaryTags = await Tag.getAll();
        const countryPrefs = await UserRepository.getCountryPreferences(userId);
        const dietaryPrefs = await UserRepository.getDietaryPreferences(userId);

        res.render('settings', {
            error: null,
            success: null,
            profile,
            countries,
            dietaryTags,
            selectedCountries: countryPrefs.map(c => String(c.country_id)),
            selectedDietary: dietaryPrefs.map(d => String(d.dietary_id)),
        });

    } catch (err) {

        console.error('Settings GET error:', err);
        res.status(500).send('Something went wrong loading settings.');
    }
});
function normaliseArray(value) {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
}

// POST /profile/settings
router.post('/settings', async (req, res) => {

    try {

        if (!req.session.user) {

            return res.redirect('/auth/signin');
        }

        const userId = req.session.user.user_id;
        const { username, bio, password } = req.body;

        const countryIds = normaliseArray(req.body.country_ids);
        const dietaryIds = normaliseArray(req.body.dietary_ids);

        if (username && username.trim() !== req.session.user.username) {

            const existingUser = await db.query(
                'SELECT user_id FROM `user` WHERE username = ? AND user_id != ?',
                [username.trim(), userId]
            );

            if (existingUser.length > 0) {
                return res.status(400).send('That username is already taken.');
            }

            await UserRepository.updateUsername(userId, username.trim());
            req.session.user.username = username.trim();
        }

        if (password && password.length > 0) {

            const hashedPassword = await bcrypt.hash(password, 10);

            await UserRepository.updatePassword(userId, hashedPassword);
        }

        const profile = await UserRepository.getUserProfileByUserID(userId);

        if (profile) {

            await UserRepository.updateUserProfile(userId, bio || '', profile.photo_id || null);

        } else {

            await UserRepository.createUserProfile(userId, bio || '', null);
        }

        await UserRepository.setCountryPreferences(userId, countryIds);
        await UserRepository.setDietaryPreferences(userId, dietaryIds);

        res.redirect('/profile/settings');

    } catch (err) {

        console.error('Settings POST error:', err);
        res.status(500).send('Something went wrong saving settings.');
    }
});

module.exports = router;
