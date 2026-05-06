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
// DIRECT ROUTE (ROOT)
// ==============================

// Home page
app.get("/", function(req, res) {
    res.render('index', {
        user: req.session.user || null
    });
});

// ==============================
// LOAD ROUTERS
// ==============================
app.use('/auth', require('./routes/auth'));
app.use('/recipe', require('./routes/recipe'));
app.use('/explore', require('./routes/explore'));
app.use('/profile', require('./routes/profile'));
app.use('/', require('./routes/posts'));

// ==============================
// START SERVER
// ==============================
app.listen(3000, function () {
  console.log(`Server running at http://127.0.0.1:3000/`);
});
