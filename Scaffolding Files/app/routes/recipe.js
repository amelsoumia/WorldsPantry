const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

router.get('/:id', async (req, res) => {

    try {
        const recipe = new Recipe(req.params.id);
        await recipe.getRecipeData();

        res.render('recipe_page', {
            recipe,
            user: req.session?.user || null
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading recipe');
    }
});

module.exports = router;