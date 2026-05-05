const express = require('express');
const router = express.Router();

const Recipe = require('../models/Recipe');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const UserRepository = require('../models/UserRepository');
const RecommendationService = require('../services/RecommendationService');


router.get('/', async (req, res) => {

    try {
        // Checks if any search has been made or filters applied
        const search = req.query.search || '';
        const countryId = req.query.country || '';

        let dietaryIds = req.query.dietary || [];

        if (!Array.isArray(dietaryIds)) {
            dietaryIds = dietaryIds ? [dietaryIds] : [];
        }

        let recipes = await Recipe.searchAndFilter(search, countryId, dietaryIds);

        if (req.session?.user) {
            const userID = req.session.user.user_id;

            const countryPreferences = await UserRepository.getCountryPreferences(userID);
            const dietaryPreferences = await UserRepository.getDietaryPreferences(userID);

            recipes = RecommendationService.sortRecipes(
                recipes,
                countryPreferences,
                dietaryPreferences
            );
        }

        const countries = await Category.getAll();
        const dietaryTags = await Tag.getAll();

        res.render('explore-page', {
            recipes,
            countries,
            dietaryTags,
            selectedSearch: search,
            selectedCountry: countryId,
            selectedDietary: dietaryIds,
            user: req.session?.user || null
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading explore page');
    }
});

module.exports = router;