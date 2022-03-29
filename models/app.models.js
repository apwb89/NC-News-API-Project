const db = require("../db/connection");

exports.getAllTopics = async () => {
  const results = await db.query("SELECT * FROM topics;");
  return results.rows;
};

exports.getAllUsernames = async () => {
  const results = await db.query("SELECT username FROM users");
  return results.rows;
};

exports.getAllArticles = async () => {
  const results = await db.query(
    `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(articles.article_id)
    AS comment_count 
    FROM articles 
    FULL OUTER JOIN comments 
    ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`
  );
  return results.rows;
};

