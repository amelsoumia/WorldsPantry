// Interacts with database 
// Responsible for persisting, fetching, and updating user information 

const db = require('../services/db');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');

class UserRepository {

    // Returns a list of users and their information (for admin view listing)
    static async getAllUsers() {

        const sql = `SELECT * FROM \`user\` ORDER BY join_date DESC`;

        const users = await db.query(sql);

        return users.map(user => new User(
            user.user_id,
            user.username,
            user.password_hash,
            user.join_date
        ));
    }

    static async createUser(username, passwordHash) {

        const sql = `INSERT INTO \`user\` (username, password_hash, join_date) VALUES (?, ?, NOW())`;

        const result = await db.query(sql, [username, passwordHash]);

        return result.insertId; // returns generated id of the created user 
    }

    static async getUserByID(userID) {

        const sql = `SELECT * FROM \`user\` WHERE user_id = ?`;

        const rows = await db.query(sql, [userID]);

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

        const sql = `SELECT * FROM \`user\` WHERE username = ?`;

        const rows = await db.query(sql, [username]);

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
            UPDATE \`user\`
            SET username = ?
            WHERE user_id = ?
        `;

        await db.query(sql, [newUsername, userID]);
    }

    static async updatePassword(userID, newPasswordHash) {

        const sql = `
            UPDATE \`user\`
            SET password_hash = ?
            WHERE user_id = ?
        `;

        await db.query(sql, [newPasswordHash, userID]);
    }

    static async getUserProfileByUserID(userID) {

        const sql = `
        SELECT profile_id, user_id, bio, photo_id
        FROM user_profile
        WHERE user_id = ?
    `;

        const rows = await db.query(sql, [userID]);

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        return new UserProfile(
            row.profile_id,
            row.user_id,
            row.bio,
            row.photo_id
        );
    }

    static async createUserProfile(userID, bio = '', profileImage = null) {

        const sql = `
            INSERT INTO user_profile (user_id, bio, photo_id)
            VALUES (?, ?, ?)
        `;

        const result = await db.query(sql, [
            userID,
            bio,
            profileImage
        ]);

        return result.insertId;
    }

    static async updateUserProfile(userID, bio, profileImage) {

        const sql = `
            UPDATE user_profile
            SET bio = ?, photo_id = ?
            WHERE user_id = ?
        `;

        await db.query(sql, [
            bio,
            profileImage,
            userID
        ]);
    }

    static async getDietaryPreferences(userID) {

        const sql = `
        SELECT dp.dietary_id, dc.name
        FROM dietary_preference dp
        JOIN dietary_category dc ON dp.dietary_id = dc.dietary_id
        WHERE dp.user_id = ?
    `;

        const rows = await db.query(sql, [userID]);
        return rows;
    }

    static async setCountryPreferences(userID, countryIds) {

        await db.query(
            `DELETE FROM country_preference WHERE user_id = ?`,
            [userID]
        );

        for (const countryId of countryIds) {
            await db.query(
                `INSERT IGNORE INTO country_preference (user_id, country_id)
             VALUES (?, ?)`,
                [userID, countryId]
            );
        }
    }

    static async setDietaryPreferences(userID, dietaryIds) {

        // remove old
        await db.query(
            `DELETE FROM dietary_preference WHERE user_id = ?`,
            [userID]
        );

        // insert new
        for (const dietaryId of dietaryIds) {
            await db.query(
                `INSERT IGNORE INTO dietary_preference (user_id, dietary_id)
             VALUES (?, ?)`,
                [userID, dietaryId]
            );
        }
    }

    static async getCountryPreferences(userID) {

        const sql = `
        SELECT cp.country_id, cc.name
        FROM country_preference cp
        JOIN country_category cc ON cp.country_id = cc.country_id
        WHERE cp.user_id = ?
    `;

        const rows = await db.query(sql, [userID]);
        return rows;
    }
}

module.exports = UserRepository;