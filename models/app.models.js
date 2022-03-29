const db = require('../db/connection');

exports.getAllTopics = async () => {
    const results = await db.query('SELECT * FROM topics;');
        return results.rows;
    }

exports.getAllUsernames = async () => {
    const results = await db.query('SELECT username FROM users');
        return results.rows;
}

exports.getAllArticles = async () => {
    //add comment count when doing that card, realised should have done them in different order
    const results = await db.query('SELECT article_id, title, topic, author, created_at, votes FROM articles ORDER BY created_at DESC;');
        return results.rows;
}