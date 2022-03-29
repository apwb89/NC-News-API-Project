const db = require('../db/connection');
const { convertTimestampToDate } = require('../db/helpers/utils')

exports.getAllTopics = async () => {
    const results = await db.query('SELECT * FROM topics;');
        return results.rows;
    };

exports.getAllUsernames = async () => {
    const results = await db.query('SELECT username FROM users');
        return results.rows;
};

exports.getArticleFromDbById = async (articleId) => {
            const results = await db.query(`SELECT * FROM articles WHERE article_id=$1`, [articleId]);
            if (results.rows.length) {
                //Covert timestamp to date using helper.
                const convertedResults = convertTimestampToDate(results.rows);
                return convertedResults["0"];
            } else {
                return Promise.reject({msg: 'Not Found', status: 404});  
            }
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
