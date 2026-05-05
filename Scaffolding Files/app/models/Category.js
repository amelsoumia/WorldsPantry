// Category Model
// Responsible for country tags
// Responsible for: Emmanuel Onyenekwe

const db = require('../services/db');

class Category {

    // Get all categories  
    static async getAll() {

        return db.query(`
        SELECT country_id, name
        FROM country_category
        ORDER BY name ASC`
        );
    }

    // Get all categories with recipe counts
    static async getAllWithCounts() {

        return db.query(`
            SELECT c.country_id, c.name, COUNT(r.recipe_id) AS recipe_count
            FROM country_category c
            LEFT JOIN recipe r ON c.country_id = r.country_id
            GROUP BY c.country_id, c.name
            ORDER BY c.name ASC
        `);
    }

    // Get a single category by ID
    static async getById(countryId) {

        const rows = await db.query(
            `SELECT country_id, name
            FROM country_category
            WHERE country_id = ?`,
            [countryId]
        );

        return rows[0] || null;
    }

    // Get a category and all its recipes
    static async getWithRecipes(countryId) {

        const categoryRows = await db.query(`
            SELECT country_id, name
            FROM country_category
            WHERE country_id = ?
        `, [countryId]);

        if (!categoryRows[0]) return null;

        const recipes = await db.query(`
            SELECT r.*, u.username
            FROM recipe r
            JOIN \`user\` u ON r.user_id = u.user_id
            WHERE r.country_id = ?
            ORDER BY r.recipe_id DESC
        `, [countryId]);

        return { ...categoryRows[0], recipes };

    }
}

module.exports = Category;
