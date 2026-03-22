// Import express.js
const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Enable form handling
app.use(express.urlencoded({ extended: true }));

// Set PUG as view engine
app.set('view engine', 'pug');

// Get the database connection
const db = require('./services/db');


// Create a route for root - /
app.get("/", function(req, res) {
    res.send("Hello world!");
});

// Start server on port 3000
app.listen(3000, function () {
  console.log(`Server running at http://127.0.0.1:3000/`);
});