// Post Routes: create, edit, delete, save, unsave
// Responsible for: Emmanuel Onyenekwe

const SavedRecipe = require('../models/SavedRecipe');
const express = require('express');
const router = express.Router();
const db = require('../services/db');

// ==============================
// CREATE RECIPE
// ==============================

router.get('/recipe/create', async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/auth/signin');

        const countries = await db.query(
            'SELECT country_id, name FROM country_category ORDER BY name'
        );

        res.render('create-recipe', {
            countries,
            error: null,
            formData: {}
        });

    } catch (err) {
        console.error('Create recipe GET error:', err);
        res.status(500).send('Something went wrong loading the create recipe page.');
    }
});

router.post('/recipe/create', async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/auth/signin');

        const user_id = req.session.user.user_id;
        const { title, description, ingredient_list, instructions, country_id } = req.body;

        if (!title || !title.trim()) {
            const countries = await db.query(
                'SELECT country_id, name FROM country_category ORDER BY name'
            );

            return res.render('create-recipe', {
                countries,
                error: 'Recipe title is required.',
                formData: req.body
            });
        }

        await db.query(
            `INSERT INTO recipe 
       (user_id, title, description, ingredient_list, instructions, country_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [
                user_id,
                title.trim(),
                description || null,
                ingredient_list || null,
                instructions || null,
                country_id || null
            ]
        );

        res.redirect('/profile');

    } catch (err) {
        console.error('Create recipe POST error:', err);
        res.status(500).send('Something went wrong saving your recipe.');
    }
});

// ==============================
// EDIT RECIPE
// ==============================

router.get('/recipe/:id/edit', async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/auth/signin');

        const user_id = req.session.user.user_id;

        const rows = await db.query(
            'SELECT * FROM recipe WHERE recipe_id = ? AND user_id = ?',
            [req.params.id, user_id]
        );

        if (rows.length === 0) {
            return res.status(404).send('Recipe not found or not yours.');
        }

        const countries = await db.query(
            'SELECT country_id, name FROM country_category ORDER BY name'
        );

        res.render('edit-recipe', {
            recipe: rows[0],
            countries,
            error: null
        });

    } catch (err) {
        console.error('Edit recipe GET error:', err);
        res.status(500).send('Something went wrong loading the edit page.');
    }
});

router.post('/recipe/:id/edit', async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/auth/signin');

        const user_id = req.session.user.user_id;
        const { title, description, ingredient_list, instructions, country_id } = req.body;

        if (!title || !title.trim()) {
            const rows = await db.query(
                'SELECT * FROM recipe WHERE recipe_id = ? AND user_id = ?',
                [req.params.id, user_id]
            );

            const countries = await db.query(
                'SELECT country_id, name FROM country_category ORDER BY name'
            );

            return res.render('edit-recipe', {
                recipe: rows[0],
                countries,
                error: 'Recipe title is required.'
            });
        }

        const result = await db.query(
            `UPDATE recipe
       SET title = ?, description = ?, ingredient_list = ?, instructions = ?, country_id = ?
       WHERE recipe_id = ? AND user_id = ?`,
            [
                title.trim(),
                description || null,
                ingredient_list || null,
                instructions || null,
                country_id || null,
                req.params.id,
                user_id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(403).send('You do not have permission to edit this recipe.');
        }

        res.redirect(`/recipe/${req.params.id}`);

    } catch (err) {
        console.error('Edit recipe POST error:', err);
        res.status(500).send('Something went wrong saving your edits.');
    }
});

// ==============================
// DELETE RECIPE
// ==============================

router.post('/recipe/:id/delete', async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/auth/signin');

        const user_id = req.session.user.user_id;

        const result = await db.query(
            'DELETE FROM recipe WHERE recipe_id = ? AND user_id = ?',
            [req.params.id, user_id]
        );

        if (result.affectedRows === 0) {
            return res.status(403).send('Recipe not found or not yours.');
        }

        res.redirect('/profile');

    } catch (err) {
        console.error('Delete recipe error:', err);
        res.status(500).send('Something went wrong deleting the recipe.');
    }
});

// ==============================
// SAVE / UNSAVE RECIPE
// ==============================

router.post('/recipe/:id/save', async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/auth/signin');

        const user_id = req.session.user.user_id;

        const saved = new SavedRecipe(user_id, req.params.id);
        await saved.save();

        res.redirect(`/recipe/${req.params.id}`);

    } catch (err) {
        console.error('Save recipe error:', err);
        res.status(500).send('Something went wrong saving the recipe.');
    }
});

router.post('/recipe/:id/unsave', async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/auth/signin');

        const user_id = req.session.user.user_id;

        const saved = new SavedRecipe(user_id, req.params.id);
        await saved.unsave();

        res.redirect(req.get('Referrer') || '/profile');

    } catch (err) {
        console.error('Unsave recipe error:', err);
        res.status(500).send('Something went wrong.');
    }
});

module.exports = router;