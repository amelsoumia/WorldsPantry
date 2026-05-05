// Auth Routes (Sign In / Sign Up)
// Responsible for: Emmanuel Onyenekwe

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../services/db');

// GET /auth/signup
router.get('/signup', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('signup', { title: 'Create Account', error: null, formData: {} });
});

// POST /auth/signup
router.post('/signup', async (req, res) => {
  const { username, password, confirm_password } = req.body;

  if (!username || !password) {
    return res.render('signup', {
      title: 'Create Account',
      error: 'All fields are required.',
      formData: req.body,
    });
  }

  if (password !== confirm_password) {
    return res.render('signup', {
      title: 'Create Account',
      error: 'Passwords do not match.',
      formData: req.body,
    });
  }

  if (password.length < 8) {
    return res.render('signup', {
      title: 'Create Account',
      error: 'Password must be at least 8 characters.',
      formData: req.body,
    });
  }

  try {
    // Check username not taken
    const existingUsername = await db.query('SELECT user_id FROM User WHERE username = ?', [username]);
    if (existingUsername.length > 0) {
      return res.render('signup', {
        title: 'Create Account',
        error: 'This username is already taken.',
        formData: req.body,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
  'INSERT INTO `user` (username, password_hash) VALUES (?, ?)',
  [username, hashedPassword]
);

    const newUser = await db.query('SELECT * FROM User WHERE username = ?', [username]);
    req.session.user = { user_id: newUser[0].user_id, username: newUser[0].username };
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
router.get('/signin', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('signin', { title: 'Sign In', error: null });
});

// POST /auth/signin
router.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render('signin', {
      title: 'Sign In',
      error: 'Email and password are required.',
    });
  }

  try {
    const rows = await db.query('SELECT * FROM User WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.render('signin', {
        title: 'Sign In',
        error: 'Invalid email or password.',
      });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.render('signin', {
        title: 'Sign In',
        error: 'Invalid email or password.',
      });
    }

    req.session.user = { user_id: user.user_id, username: user.username };
    res.redirect('/');
  } catch (err) {
    console.error('Signin error:', err);
    res.render('signin', { title: 'Sign In', error: 'Something went wrong.' });
  }
});

// GET /auth/signout
router.get('/signout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;
