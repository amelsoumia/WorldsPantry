const db = require('../services/db');

class Recipe {
    constructor(recipe_id) {
        this.recipe_id = recipe_id;
    }

    // Fetches all recipe information for one recipe
    async getRecipeData() {

        const rows = await db.query(`
        SELECT 
            r.recipe_id,
            r.user_id,
            r.title,
            r.ingredient_list,
            r.description,
            r.instructions,
            r.country_id,
            u.username,
            cc.name AS country_name,
            p.url AS image_url
        FROM recipe r
        JOIN \`user\` u ON r.user_id = u.user_id
        LEFT JOIN country_category cc ON r.country_id = cc.country_id
        LEFT JOIN recipephoto rp ON r.recipe_id = rp.recipe_id
        LEFT JOIN photo p ON rp.photo_id = p.photo_id
        WHERE r.recipe_id = ?
        LIMIT 1`, [this.recipe_id]
        );

        if (rows.length === 0) return null;

        Object.assign(this, rows[0]);
        this.dietary_tags = await Recipe.getDietaryTags(this.recipe_id);

        return this;
    }

    // Fetches all recipe information for all recipes
    static async getAllWithDetails() {

        const recipes = await db.query(`
            SELECT r.recipe_id, r.user_id, r.title, r.ingredient_list,
                   r.description, r.instructions, r.country_id,
                   u.username,
                   cc.name AS country_name,
                   MIN(p.url) AS image_url
            FROM recipe r
            JOIN \`user\` u ON r.user_id = u.user_id
            LEFT JOIN country_category cc ON r.country_id = cc.country_id
            LEFT JOIN recipephoto rp ON r.recipe_id = rp.recipe_id
            LEFT JOIN photo p ON rp.photo_id = p.photo_id
            GROUP BY r.recipe_id
            ORDER BY r.recipe_id DESC`
        );

        return await Recipe.attachDietaryTags(recipes);
    }

    // Filters recipes based on search and tags
    static async searchAndFilter(search, countryId, dietaryIds = []) {

        let sql = `
            SELECT DISTINCT r.recipe_id, r.user_id, r.title, r.ingredient_list,
                   r.description, r.instructions, r.country_id,
                   u.username,
                   cc.name AS country_name,
                   MIN(p.url) AS image_url
            FROM recipe r
            JOIN \`user\` u ON r.user_id = u.user_id
            LEFT JOIN country_category cc ON r.country_id = cc.country_id
            LEFT JOIN recipe_dietary_tags rdt ON r.recipe_id = rdt.recipe_id
            LEFT JOIN recipephoto rp ON r.recipe_id = rp.recipe_id
            LEFT JOIN photo p ON rp.photo_id = p.photo_id
            WHERE 1 = 1
        `;

        const params = [];

        if (search) {
            sql += `
                AND (
                    r.title LIKE ?
                    OR r.description LIKE ?
                    OR r.ingredient_list LIKE ?
                )
            `;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (countryId) {

            sql += ` AND r.country_id = ?`;
            params.push(countryId);
        }

        if (dietaryIds.length > 0) {

            sql += ` AND rdt.dietary_id IN (${dietaryIds.map(() => '?').join(',')})`;
            params.push(...dietaryIds);
        }

        sql += `
            GROUP BY r.recipe_id
            ORDER BY r.recipe_id DESC
        `;

        const recipes = await db.query(sql, params);
        return await Recipe.attachDietaryTags(recipes);
    }

    // Helper function to get dietary tags for a recipe
    static async getDietaryTags(recipeId) {

        return db.query(`
            SELECT dc.dietary_id, dc.name
            FROM recipe_dietary_tags rdt
            JOIN dietary_category dc ON rdt.dietary_id = dc.dietary_id
            WHERE rdt.recipe_id = ?
            ORDER BY dc.name ASC`, [recipeId]
        );
    }

    // Helper function that loops through fetched recipes and adds their dietary tags from the database
    static async attachDietaryTags(recipes) {

        for (const recipe of recipes) {
            recipe.dietary_tags = await Recipe.getDietaryTags(recipe.recipe_id);
        }

        return recipes;
    }

    // Returns all recipes created by a user
    static async getByUser(userId) {

        return db.query(`
            SELECT recipe_id, title, description
            FROM recipe
            WHERE user_id = ?
            ORDER BY recipe_id DESC`, [userId]
        );
    }

    // Delete recipe only if it belongs to the logged-in user
    static async deleteRecipe(recipeId, userId) {

        return db.query(`
        DELETE FROM recipe
        WHERE recipe_id = ? AND user_id = ?
    `, [recipeId, userId]);
    }
}

module.exports = Recipe;