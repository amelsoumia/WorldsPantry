// Post Routes: create, edit, delete, save, unsave
// Responsible for: Emmanuel Onyenekwe

const SavedRecipe = require('../models/SavedRecipe');
const express = require('express');
const router = express.Router();
const db = require('../services/db');

function normaliseArray(value) {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
}

async function setRecipeDietaryTags(recipeId, dietaryIds) {
    await db.query('DELETE FROM recipe_dietary_tags WHERE recipe_id = ?', [recipeId]);

    for (const dietaryId of dietaryIds) {
        await db.query(
            'INSERT INTO recipe_dietary_tags (recipe_id, dietary_id) VALUES (?, ?)',
            [recipeId, dietaryId]
        );
    }
}

async function setRecipePhoto(recipeId, imageUrl) {
    await db.query('DELETE FROM recipephoto WHERE recipe_id = ?', [recipeId]);

    if (!imageUrl || !imageUrl.trim()) return;

    const result = await db.query(
        'INSERT INTO photo (url) VALUES (?)',
        [imageUrl.trim()]
    );

    await db.query(
        'INSERT INTO recipephoto (recipe_id, photo_id) VALUES (?, ?)',
        [recipeId, result.insertId]
    );
}

// ==============================
// CREATE RECIPE
// ==============================

router.get('/recipe/create', async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/auth/signin');

        const countries = await db.query(
            'SELECT country_id, name FROM country_category ORDER BY name'
        );

        const dietaryTags = await db.query(
            'SELECT dietary_id, name FROM dietary_category ORDER BY name'
        );

        res.render('create-recipe', {
            countries,
            dietaryTags,
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

        const {
            title,
            description,
            ingredient_list,
            instructions,
            country_id,
            image_url
        } = req.body;

        const dietaryIds = normaliseArray(req.body.dietary_ids);

        if (!title || !title.trim()) {
            const countries = await db.query(
                'SELECT country_id, name FROM country_category ORDER BY name'
            );

            const dietaryTags = await db.query(
                'SELECT dietary_id, name FROM dietary_category ORDER BY name'
            );

            return res.render('create-recipe', {
                countries,
                dietaryTags,
                error: 'Recipe title is required.',
                formData: req.body
            });
        }

        const result = await db.query(
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

        await setRecipeDietaryTags(result.insertId, dietaryIds);
        await setRecipePhoto(result.insertId, image_url);

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
            `SELECT r.*, p.url AS image_url
             FROM recipe r
             LEFT JOIN recipephoto rp ON r.recipe_id = rp.recipe_id
             LEFT JOIN photo p ON rp.photo_id = p.photo_id
             WHERE r.recipe_id = ? AND r.user_id = ?
             LIMIT 1`,
            [req.params.id, user_id]
        );

        if (rows.length === 0) {
            return res.status(404).send('Recipe not found or not yours.');
        }

        const countries = await db.query(
            'SELECT country_id, name FROM country_category ORDER BY name'
        );

        const dietaryTags = await db.query(
            'SELECT dietary_id, name FROM dietary_category ORDER BY name'
        );

        const selectedRows = await db.query(
            'SELECT dietary_id FROM recipe_dietary_tags WHERE recipe_id = ?',
            [req.params.id]
        );

        res.render('edit-recipe', {
            recipe: rows[0],
            countries,
            dietaryTags,
            selectedDietary: selectedRows.map(row => String(row.dietary_id)),
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

        const {
            title,
            description,
            ingredient_list,
            instructions,
            country_id,
            image_url
        } = req.body;

        const dietaryIds = normaliseArray(req.body.dietary_ids);

        if (!title || !title.trim()) {
            return res.status(400).send('Recipe title is required.');
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

        await setRecipeDietaryTags(req.params.id, dietaryIds);
        await setRecipePhoto(req.params.id, image_url);

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