// Tags Routes
// Responsible for: Emmanuel Onyenekwe

const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');

// GET /tags
router.get('/', async (req, res) => {
  try {
    const grouped = await Tag.getAllGrouped();
    const withCounts = await Tag.getAllWithCounts();
    const countMap = {};
    withCounts.forEach(t => (countMap[t.tag_id] = t.recipe_count));
    res.render('tags/index', {
      title: 'Browse by Tag',
      countryTags: grouped.country,
      dietaryTags: grouped.dietary,
      countMap,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading tags');
  }
});

// GET /tags/:id
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.getWithRecipes(req.params.id);
    if (!tag) return res.status(404).send('Tag not found');
    res.render('tags/detail', { title: tag.name, tag });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading tag');
  }
});

module.exports = router;
