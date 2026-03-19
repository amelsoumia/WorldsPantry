// Categories Routes
// Responsible for: Emmanuel Onyenekwe

const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// GET /categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.getAllWithCounts();
    res.render('categories/index', { title: 'Browse by Category', categories });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading categories');
  }
});

// GET /categories/:id
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.getWithRecipes(req.params.id);
    if (!category) return res.status(404).send('Category not found');
    res.render('categories/detail', { title: category.name, category });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading category');
  }
});

module.exports = router;
