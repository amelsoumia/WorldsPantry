// Import express.js
const express = require("express");
const Category = require('./models/Category');
const Tag = require('./models/Tag');
const Recipe = require('./models/Recipe'); // (IMPORTANT: was missing)

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

// Explore page
app.get('/explore', async (req, res) => {

    const categories = await Category.getAllWithCounts();
    const countryTags = await Tag.getCountryTags();
    const dietaryTags = await Tag.getDietaryTags();
    const allRecipes = await Recipe.getAllForBrowse();

    res.render('explore-page', {
        categories,
        countryTags,
        dietaryTags,
        allRecipes
    });
});


// ==============================
// ROUTERS (TEAM STRUCTURE)
// ==============================

// Existing recipe routes
const recipeRouter = require('./services/recipe');
app.use('/', recipeRouter);

// YOUR routes (profile + settings)
app.use('/', require('./routes/profile'));


// ==============================
// START SERVER
// ==============================

app.listen(3000, function () {
  console.log(`Server running at http://127.0.0.1:3000/`);
});