// Import express.js
const express = require("express");
const Category = require('./models/Category');
const Tag = require('./models/Tag');

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


// Create a route for root - /
app.get("/", function(req, res) {
    res.render('index');
});

// Create a route for browsing page
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

const recipeRouter = require('./services/recipe');
app.use('/', recipeRouter);

// Start server on port 3000
app.listen(3000, function () {
  console.log(`Server running at http://127.0.0.1:3000/`);
});