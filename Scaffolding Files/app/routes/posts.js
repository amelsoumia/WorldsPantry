// Post Routes: create, edit, delete, save, unsave
// Responsible for: Emmanuel Onyenekwe

const express = require('express');
const router = express.Router();
const { Recipe } = require('../models/Recipe');
const { SavedRecipe } = require('../models/SavedRecipe');
const db = require('../services/db');

// ==============================
// CREATE RECIPE
// ==============================

// GET /recipe/create — show the create form
router.get('/recipe/create', async (req, res) => {
  try {
    // TODO: replace with req.session.user.user_id once auth is wired
    const user_id = 1;

    const countries = await db.query('SELECT country_id, name FROM country_category ORDER BY name');

    res.render('create-recipe', { countries, error: null });
  } catch (err) {
    console.error('Create recipe GET error:', err);
    res.status(500).send('Something went wrong.');
  }
});

// POST /recipe/create — handle form submission
router.post('/recipe/create', async (req, res) => {
  try {
    // TODO: replace with req.session.user.user_id once auth is wired
    const user_id = 1;

    const { title, description, ingredient_list, instructions, country_id } = req.body;

    if (!title) {
      const countries = await db.query('SELECT country_id, name FROM country_category ORDER BY name');
      return res.render('create-recipe', {
        countries,
        error: 'Recipe title is required.',
        formData: req.body,
      });
    }

    await db.query(
      `INSERT INTO recipe (user_id, title, description, ingredient_list, instructions, country_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        title,
        description || null,
        ingredient_list || null,
        instructions || null,
        country_id || null,
      ]
    );

    // Redirect to profile so user can see their new recipe
    res.redirect('/profile');
  } catch (err) {
    console.error('Create recipe POST error:', err);
    res.status(500).send('Something went wrong saving your recipe.');
  }
});

// ==============================
// EDIT RECIPE
// ==============================

// GET /recipe/:id/edit — show the edit form pre-filled
router.get('/recipe/:id/edit', async (req, res) => {
  try {
    // TODO: replace with req.session.user.user_id once auth is wired
    const user_id = 1;

    const rows = await db.query('SELECT * FROM recipe WHERE recipe_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).send('Recipe not found.');

    const recipe = rows[0];

    // TODO: ownership check — uncomment when auth is wired
    // if (recipe.user_id !== user_id) return res.status(403).send('Not your recipe.');

    const countries = await db.query('SELECT country_id, name FROM country_category ORDER BY name');

    res.render('edit-recipe', { recipe, countries, error: null });
  } catch (err) {
    console.error('Edit recipe GET error:', err);
    res.status(500).send('Something went wrong.');
  }
});

// POST /recipe/:id/edit — save the edits
router.post('/recipe/:id/edit', async (req, res) => {
  try {
    // TODO: replace with req.session.user.user_id once auth is wired
    const user_id = 1;

    const { title, description, ingredient_list, instructions, country_id } = req.body;

    if (!title) {
      const rows = await db.query('SELECT * FROM recipe WHERE recipe_id = ?', [req.params.id]);
      const countries = await db.query('SELECT country_id, name FROM country_category ORDER BY name');
      return res.render('edit-recipe', {
        recipe: rows[0],
        countries,
        error: 'Recipe title is required.',
      });
    }

    // TODO: add ownership check when auth is wired
    await db.query(
      `UPDATE recipe
       SET title = ?, description = ?, ingredient_list = ?, instructions = ?, country_id = ?
       WHERE recipe_id = ?`,
      [
        title,
        description || null,
        ingredient_list || null,
        instructions || null,
        country_id || null,
        req.params.id,
      ]
    );

    res.redirect(`/recipe/${req.params.id}`);
  } catch (err) {
    console.error('Edit recipe POST error:', err);
    res.status(500).send('Something went wrong saving your edits.');
  }
});

// ==============================
// DELETE RECIPE
// ==============================

// POST /recipe/:id/delete
router.post('/recipe/:id/delete', async (req, res) => {
  try {
    // TODO: replace with req.session.user.user_id once auth is wired
    const user_id = 1;

    // TODO: add ownership check when auth is wired
    await db.query('DELETE FROM recipe WHERE recipe_id = ?', [req.params.id]);

    res.redirect('/profile');
  } catch (err) {
    console.error('Delete recipe error:', err);
    res.status(500).send('Something went wrong deleting the recipe.');
  }
});

// ==============================
// SAVE / UNSAVE RECIPE
// ==============================

// POST /recipe/:id/save
router.post('/recipe/:id/save', async (req, res) => {
  try {
    // TODO: replace with req.session.user.user_id once auth is wired
    const user_id = 1;

    const saved = new SavedRecipe(user_id, req.params.id);
    await saved.save();

    res.redirect(`/recipe/${req.params.id}`);
  } catch (err) {
    console.error('Save recipe error:', err);
    res.status(500).send('Something went wrong saving the recipe.');
  }
});

// POST /recipe/:id/unsave
router.post('/recipe/:id/unsave', async (req, res) => {
  try {
    // TODO: replace with req.session.user.user_id once auth is wired
    const user_id = 1;

    const saved = new SavedRecipe(user_id, req.params.id);
    await saved.unsave();

    res.redirect('/profile');
  } catch (err) {
    console.error('Unsave recipe error:', err);
    res.status(500).send('Something went wrong.');
  }
});

module.exports = router;
