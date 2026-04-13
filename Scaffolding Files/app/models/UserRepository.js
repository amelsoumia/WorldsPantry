// Interacts with database 
// Responsible for persisting, fetching, and updating user information 

const db = require('../services/db');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');

class UserRepository {

    // Returns a list of users and their information (for admin view listing)
    static async getAllUsers() {

        const sql = `SELECT * FROM user ORDER BY join_date DESC`;

        const [users] = await db.execute(sql);

        return users.map(user => new User(
            user.user_id,
            user.username,
            user.password_hash,
            user.join_date
        ));
    }

    static async createUser(username, passwordHash) {

        const sql = `INSERT INTO user (username, password_hash, join_date) VALUES (?, ?, NOW())`;

        const [result] = await db.execute(sql, [username, passwordHash]);

        return result.insertId; // returns generated id of the created user 
    }

    static async getUserByID(userID) {

        const sql = `SELECT * FROM user WHERE user_id = ?`;

        const [rows] = await db.execute(sql, [userID]);

        if (rows.length === 0) {
            return null;
        }

        const user = rows[0];

        return new User(
            user.user_id,
            user.username,
            user.password_hash,
            user.join_date
        );
    }

    static async getUserByUsername(username) {

        const sql = `SELECT * FROM user WHERE username = ?`;

        const [rows] = await db.execute(sql, [username]);

        if (rows.length === 0) {
            return null;
        }

        const user = rows[0];

        return new User(
            user.user_id,
            user.username,
            user.password_hash,
            user.join_date
        );
    }

    static async updateUsername(userID, newUsername) {

        const sql = `
            UPDATE user
            SET username = ?
            WHERE user_id = ?
        `;

        await db.execute(sql, [newUsername, userID]);
    }

    static async updatePassword(userID, newPasswordHash) {

        const sql = `
            UPDATE user
            SET password_hash = ?
            WHERE user_id = ?
        `;

        await db.execute(sql, [newPasswordHash, userID]);
    }

    static async getUserProfileByUserID(userID) {

        const sql = `
            SELECT profile_id, user_id, bio, profile_image, dietary_preferences
            FROM user_profiles
            WHERE user_id = ?
        `;

        const [rows] = await db.execute(sql, [userID]);

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        return new UserProfile(
            row.profile_id,
            row.user_id,
            row.bio,
            row.profile_image,
            row.dietary_preferences
        );
    }

    static async createUserProfile(userID, bio = '', profileImage = '', dietaryPreferences = '') {

        const sql = `
            INSERT INTO user_profiles (user_id, bio, profile_image, dietary_preferences)
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await db.execute(sql, [
            userID,
            bio,
            profileImage,
            dietaryPreferences
        ]);

        return result.insertId;
    }

    static async updateUserProfile(userID, bio, profileImage, dietaryPreferences) {

        const sql = `
            UPDATE user_profiles
            SET bio = ?, profile_image = ?, dietary_preferences = ?
            WHERE user_id = ?
        `;

        await db.execute(sql, [
            bio,
            profileImage,
            dietaryPreferences,
            userID
        ]);
    }
}

module.exports = UserRepository;