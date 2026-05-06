// Auth Routes (Sign In / Sign Up)
// Responsible for: Emmanuel Onyenekwe
// Handles user authentication: signup, signin, signout, and session management

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // For hashing and comparing passwords
const db = require('../services/db'); // Database connection/service

// GET /auth/signup
// Displays signup page (redirects if already logged in)
router.get('/signup', (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('signup', { title: 'Create Account', error: null, formData: {} });
});

// POST /auth/signup
// Creates a new user account with validation and password hashing
router.post('/signup', async (req, res) => {
    const { username, password, confirm_password } = req.body;

    // Check required fields
    if (!username || !password || !confirm_password) {
        return res.render('signup', {
            title: 'Create Account',
            error: 'All fields are required.',
            formData: req.body,
        });
    }

    // Check password match
    if (password !== confirm_password) {
        return res.render('signup', {
            title: 'Create Account',
            error: 'Passwords do not match.',
            formData: req.body,
        });
    }

    // Enforce password length
    if (password.length < 8) {
        return res.render('signup', {
            title: 'Create Account',
            error: 'Password must be at least 8 characters.',
            formData: req.body,
        });
    }

    try {
        // Check if username already exists
        const existingUsername = await db.query(
            'SELECT user_id FROM `user` WHERE username = ?',
            [username]
        );

        if (existingUsername.length > 0) {
            return res.render('signup', {
                title: 'Create Account',
                error: 'This username is already taken.',
                formData: req.body,
            });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into database
        await db.query(
            'INSERT INTO `user` (username, password_hash) VALUES (?, ?)',
            [username, hashedPassword]
        );

        // Fetch new user and create session
        const newUser = await db.query(
            'SELECT * FROM `user` WHERE username = ?',
            [username]
        );

        req.session.user = {
            user_id: newUser[0].user_id,
            username: newUser[0].username,
        };

        res.redirect('/');
    } catch (err) {
        console.error('Signup error:', err);
        res.render('signup', {
            title: 'Create Account',
            error: 'Something went wrong. Please try again.',
            formData: req.body,
        });
    }
});

// GET /auth/signin
// Displays signin page (redirects if already logged in)
router.get('/signin', (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('signin', { title: 'Sign In', error: null });
});

// POST /auth/signin
// Authenticates user and starts session
router.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.render('signin', {
            title: 'Sign In',
            error: 'Username and password are required.',
        });
    }

    try {
        // Find user by username
        const rows = await db.query(
            'SELECT * FROM `user` WHERE username = ?',
            [username]
        );

        if (rows.length === 0) {
            return res.render('signin', {
                title: 'Sign In',
                error: 'Invalid username or password.',
            });
        }

        const user = rows[0];

        // Compare password with stored hash
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.render('signin', {
                title: 'Sign In',
                error: 'Invalid username or password.',
            });
        }

        // Store user in session
        req.session.user = {
            user_id: user.user_id,
            username: user.username,
        };

        res.redirect('/');
    } catch (err) {
        console.error('Signin error:', err);
        res.render('signin', { title: 'Sign In', error: 'Something went wrong.' });
    }
});

// GET /auth/signout
// Logs user out by destroying session
router.get('/signout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

module.exports = router;
