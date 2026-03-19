// Category Model
// Responsible for: Emmanuel Onyenekwe

const db = require('../services/db');

class Category {

  // Get all categories with recipe counts
  static async getAllWithCounts() {
    return db.query(
      `SELECT c.category_id, c.name, COUNT(r.recipe_id) AS recipe_count
       FROM Category c
       LEFT JOIN Recipe r ON c.category_id = r.category_id
       GROUP BY c.category_id, c.name
       ORDER BY c.name ASC`
    );
  }

  // Get a single category by ID
  static async getById(categoryId) {
    const rows = await db.query(
      'SELECT * FROM Category WHERE category_id = ?',
      [categoryId]
    );
    return rows[0] || null;
  }

  // Get a category and all its recipes
  static async getWithRecipes(categoryId) {
    const categoryRows = await db.query(
      'SELECT * FROM Category WHERE category_id = ?',
      [categoryId]
    );
    if (!categoryRows[0]) return null;

    const recipes = await db.query(
      `SELECT r.*, u.username
       FROM Recipe r
       JOIN User u ON r.user_id = u.user_id
       WHERE r.category_id = ?
       ORDER BY r.created_at DESC`,
      [categoryId]
    );

    return { ...categoryRows[0], recipes };
  }

  // Get all categories (simple list)
  static async getAll() {
    return db.query('SELECT * FROM Category ORDER BY name ASC');
  }
}

module.exports = Category;
