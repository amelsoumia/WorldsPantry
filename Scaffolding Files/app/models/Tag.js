// Tag Model
// Responsible for: Emmanuel Onyenekwe

const db = require('../services/db');

class Tag {

  // Get all tags
  static async getAll() {
    return db.query('SELECT * FROM Tag ORDER BY type ASC, name ASC');
  }

  // Get all tags grouped by type (country / dietary)
  static async getAllGrouped() {
    const rows = await db.query(
      'SELECT * FROM Tag ORDER BY type ASC, name ASC'
    );
    return {
      country: rows.filter(t => t.type === 'country'),
      dietary: rows.filter(t => t.type === 'dietary'),
    };
  }

  // Get tags with recipe counts
  static async getAllWithCounts() {
    return db.query(
      `SELECT t.tag_id, t.name, t.type, COUNT(rt.recipe_id) AS recipe_count
       FROM Tag t
       LEFT JOIN RecipeTag rt ON t.tag_id = rt.tag_id
       GROUP BY t.tag_id, t.name, t.type
       ORDER BY t.type ASC, t.name ASC`
    );
  }

  // Get a single tag by ID
  static async getById(tagId) {
    const rows = await db.query(
      'SELECT * FROM Tag WHERE tag_id = ?',
      [tagId]
    );
    return rows[0] || null;
  }

  // Get a tag and all its recipes
  static async getWithRecipes(tagId) {
    const tagRows = await db.query(
      'SELECT * FROM Tag WHERE tag_id = ?',
      [tagId]
    );
    if (!tagRows[0]) return null;

    const recipes = await db.query(
      `SELECT r.*, u.username
       FROM Recipe r
       JOIN RecipeTag rt ON r.recipe_id = rt.recipe_id
       JOIN User u ON r.user_id = u.user_id
       WHERE rt.tag_id = ?
       ORDER BY r.created_at DESC`,
      [tagId]
    );

    return { ...tagRows[0], recipes };
  }
}

module.exports = Tag;
