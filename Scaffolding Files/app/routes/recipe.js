const express = require('express');
const router = express.Router();
const { Recipe } = require('../models/Recipe');

router.get('/recipe/:id', async (req, res) => {
    const recipe = new Recipe(req.params.id);
    await recipe.getRecipeData();
    res.render('recipe_page', { recipe });
});

module.exports = router;