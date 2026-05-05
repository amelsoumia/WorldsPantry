// Import express.js
const express = require("express");
const session = require('express-session');

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Enable form handling
app.use(express.urlencoded({ extended: true }));

// Set PUG as view engine
app.set('view engine', 'pug');
app.set('views', './app/views');

// Get the database connection
const db = require('./services/db');

app.use(session({
    secret: 'worldspantry-secret',
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ==============================
// ROUTES
// ==============================

// Home page
app.get("/", function(req, res) {
    res.render('index');
});

// Login page
app.get("/login", function (req, res) {
    res.render('signin');
});

// Signup page
app.get("/signup", function (req, res) {
    res.render('signup', { formData: {} });
});


// ==============================
// ROUTERS (TEAM STRUCTURE)
// ==============================

// Existing recipe routes
app.use('/auth', require('./routes/auth'));
const recipeRouter = require('./routes/recipe');
app.use('/recipe', recipeRouter);
app.use('/explore', require('./routes/explore'));
app.use('/profile', require('./routes/profile'));
app.use('/posts', require('./routes/posts'));

// ==============================
// START SERVER
// ==============================

app.listen(3000, function () {
  console.log(`Server running at http://127.0.0.1:3000/`);
});
