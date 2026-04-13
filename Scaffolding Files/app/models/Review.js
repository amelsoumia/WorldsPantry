const db = require('../services/db');

class Review {

  // Get all reviews for a recipe
  static async getByRecipeId(recipeId) {
    return db.query(
      `SELECT r.*, u.username
       FROM review r
       JOIN user u ON r.user_id = u.user_id
       WHERE r.recipe_id = ?
       ORDER BY r.review_id DESC`,
      [recipeId]
    );
  }

  // Add a new review
  static async addReview(userId, recipeId, rating, comment) {
    return db.query(
      `INSERT INTO review (user_id, recipe_id, rating, comment)
       VALUES (?, ?, ?, ?)`,
      [userId, recipeId, rating, comment]
    );
  }

}

module.exports = Review;