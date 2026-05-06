// Creates a bcrypt hashed & salted password for example user
// Run 'node hash.js' on terminal in this directory (must 'npm install bcryptjs' locally)
// Store hashed password directly in database 

const bcrypt = require('bcryptjs');

bcrypt.hash('12345678', 10).then(hash => {
    console.log(hash);
});