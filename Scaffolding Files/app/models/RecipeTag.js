// RecipeTag Model (junction table: Recipe <-> Tag)
// Responsible for: Emmanuel Onyenekwe

const db = require('../services/db');

class RecipeTag {

    // Get all dietary tags for a recipe
    static async getTagsForRecipe(recipeId) {

        return db.query(`
        SELECT dc.dietary_id, dc.name
        FROM dietary_category dc
        JOIN recipe_dietary_tags rdt ON dc.dietary_id = rdt.dietary_id
        WHERE rdt.recipe_id = ?
        ORDER BY dc.name ASC`, [recipeId]
        );
    }

    // Add a dietary tag to a recipe
    static async addTag(recipeId, dietaryId) {

        await db.query(`
        INSERT IGNORE INTO recipe_dietary_tags (recipe_id, dietary_id)
        VALUES (?, ?)`, [recipeId, dietaryId]
        );
    }

    // Remove all dietary tags from a recipe
    static async removeAllTagsForRecipe(recipeId) {

        await db.query(`
        DELETE FROM recipe_dietary_tags
        WHERE recipe_id = ?`, [recipeId]
        );
    }

    // Replace all dietary tags on a recipe with a new set
    static async syncTags(recipeId, dietaryIds = []) {

        await RecipeTag.removeAllTagsForRecipe(recipeId);

        for (const dietaryId of dietaryIds) {

            await RecipeTag.addTag(recipeId, dietaryId);
        }
    }
}

module.exports = RecipeTag;
