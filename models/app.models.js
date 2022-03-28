const db = require('../db/connection');

exports.getAllTopics = async () => {
    const results = await db.query('SELECT * FROM topics;');
        return results.rows
    }

exports.getAllUsernames = async () => {
    const results = await db.query('SELECT username FROM users');
        return results.rows
}