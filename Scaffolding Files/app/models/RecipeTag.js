// RecipeTag Model (junction table: Recipe <-> Tag)
// Responsible for: Emmanuel Onyenekwe

const db = require('../services/db');

class RecipeTag {

  // Get all tags for a recipe
  static async getTagsForRecipe(recipeId) {
    return db.query(
      `SELECT t.tag_id, t.name, t.type
       FROM Tag t
       JOIN RecipeTag rt ON t.tag_id = rt.tag_id
       WHERE rt.recipe_id = ?
       ORDER BY t.type ASC, t.name ASC`,
      [recipeId]
    );
  }

  // Add a tag to a recipe
  static async addTag(recipeId, tagId) {
    await db.query(
      'INSERT IGNORE INTO RecipeTag (recipe_id, tag_id) VALUES (?, ?)',
      [recipeId, tagId]
    );
  }

  // Remove all tags from a recipe (used when editing)
  static async removeAllTagsForRecipe(recipeId) {
    await db.query(
      'DELETE FROM RecipeTag WHERE recipe_id = ?',
      [recipeId]
    );
  }

  // Replace all tags on a recipe with a new set
  static async syncTags(recipeId, tagIds) {
    await RecipeTag.removeAllTagsForRecipe(recipeId);
    for (const tagId of tagIds) {
      await RecipeTag.addTag(recipeId, tagId);
    }
  }
}

module.exports = RecipeTag;
