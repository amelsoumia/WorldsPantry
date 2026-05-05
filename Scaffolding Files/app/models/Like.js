// Like Model
// Responsible for: Pooji

const db = require('../services/db');

class Like {

    // Add a like
    static async addLike(userId, recipeId) {

    return db.query(
        `INSERT IGNORE INTO \`like\` (user_id, recipe_id)
        VALUES (?, ?)`,
        [userId, recipeId]
    );
    }

    // Remove a like
    static async removeLike(userId, recipeId) {

    return db.query(
        `DELETE FROM \`like\`
        WHERE user_id = ? AND recipe_id = ?`,
        [userId, recipeId]
    );
    }

    // Count likes for a recipe
    static async countByRecipe(recipeId) {

    const rows = await db.query(
        `SELECT COUNT(*) AS like_count
        FROM \`like\`
        WHERE recipe_id = ?`,
        [recipeId]
    );
    return rows[0].like_count;
    }

    // Check if user liked a recipe
    static async isLiked(userId, recipeId) {

        const rows = await db.query(
            `SELECT 1
            FROM \`like\`
            WHERE user_id = ? AND recipe_id = ?`, [userId, recipeId]
        );

        return rows.length > 0;
    }

}

module.exports = Like;