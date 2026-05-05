const db = require('../services/db');

class SavedRecipe {

  constructor(userId, recipeId) {
    this.user_id   = userId;
    this.recipe_id = recipeId;
  }

  // Save a recipe for a user
  async save() {
    await db.query(
      'INSERT IGNORE INTO save (user_id, recipe_id) VALUES (?, ?)',
      [this.user_id, this.recipe_id]
    );
  }

  // Unsave a recipe for a user
  async unsave() {
    await db.query(
      'DELETE FROM save WHERE user_id = ? AND recipe_id = ?',
      [this.user_id, this.recipe_id]
    );
  }

  // Get all recipes saved by a user
  static async getByUser(userId) {
    const sql = `
      SELECT r.recipe_id, r.title, r.description
      FROM save s
      JOIN recipe r ON s.recipe_id = r.recipe_id
      WHERE s.user_id = ?
      ORDER BY r.recipe_id DESC
    `;
    return await db.query(sql, [userId]);
  }

  // Check if a user has already saved a specific recipe
  static async isSaved(userId, recipeId) {
    const rows = await db.query(
      'SELECT 1 FROM save WHERE user_id = ? AND recipe_id = ?',
      [userId, recipeId]
    );
    return rows.length > 0;
  }

}

module.exports = SavedRecipe;
