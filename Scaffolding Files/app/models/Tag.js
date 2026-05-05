// Tag Model
// Responsible for dietary tags
// Responsible for: Emmanuel Onyenekwe

const db = require('../services/db');

class Tag {

    // Get all dietary tags
    static async getAll() {

        return db.query(`
        SELECT dietary_id, name
        FROM dietary_category
        ORDER BY name ASC`
        );
    }

    // Get tags with recipe counts
    static async getAllWithCounts() {

        return db.query(`
        SELECT dc.dietary_id, dc.name, COUNT(rdt.recipe_id) AS recipe_count
        FROM dietary_category dc
        LEFT JOIN recipe_dietary_tags rdt ON dc.dietary_id = rdt.dietary_id
        GROUP BY dc.dietary_id, dc.name
        ORDER BY dc.name ASC`
        );
    }

    // Get one tag by ID
    static async getById(dietaryId) {

        const rows = await db.query(`
        SELECT dietary_id, name
        FROM dietary_category
        WHERE dietary_id = ?`, [dietaryId]);

        return rows[0] || null;
    }

    // Get tag with all its recipes
    static async getWithRecipes(dietaryId) {

        const tagRows = await db.query(`
        SELECT dietary_id, name
        FROM dietary_category
        WHERE dietary_id = ?`, [dietaryId]
        );

        if (!tagRows[0]) return null;

        const recipes = await db.query(`
        SELECT r.*, u.username
        FROM recipe r
        JOIN recipe_dietary_tags rdt ON r.recipe_id = rdt.recipe_id
        JOIN \`user\` u ON r.user_id = u.user_id
        WHERE rdt.dietary_id = ?
        ORDER BY r.recipe_id DESC`, [dietaryId]
        );

        return { ...tagRows[0], recipes };
    }
}

module.exports = Tag;
