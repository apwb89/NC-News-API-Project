const db = require('../db/connection');
const { convertTimestampToDate, formatComments } = require('../db/helpers/utils')

exports.fetchAllTopics = async () => {
    const results = await db.query('SELECT * FROM topics;');
        return results.rows;
    };

exports.fetchAllUsernames = async () => {
    const results = await db.query('SELECT username FROM users');
        return results.rows;
};

exports.fetchArticleFromDbById = async (articleId) => {
            const results = await db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.body, articles.votes, COUNT(articles.article_id)
            AS comment_count 
            FROM articles 
            FULL OUTER JOIN comments 
            ON articles.article_id = comments.article_id 
            WHERE articles.article_id=$1
            GROUP BY articles.article_id
            ORDER BY articles.created_at DESC`, [articleId]);
            if (results.rows.length) {
                //Covert timestamp to date using helper.
                const convertedResults = convertTimestampToDate(results.rows);
                return convertedResults["0"];
            } else {
                return Promise.reject({msg: 'Not Found', status: 404});  
            }
};

exports.fetchAllArticles = async () => {
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

exports.fetchCommentsForArticle = async (articleId) => {
    const results = await db.query(`SELECT comment_id, votes, created_at, author, body 
    FROM comments WHERE article_id=$1; 
    `, [articleId])
        return results.rows;
    }

exports.sendCommentByArticleId = async(articleId, name, body) => {
    if (name && body) {
        const post = await db.query(`INSERT INTO comments (article_id, author, body)
        VALUES ($1, $2, $3) RETURNING *`, [articleId, name, body])
        return post.rows;
    } else {
        return Promise.reject({status: 400, msg: 'Bad Request'})
    }
} 

exports.removeCommentById = async (commentId) => {
    const checkId = await db.query(`SELECT * FROM comments WHERE comment_id = $1;`, [commentId])
    if(checkId.rows.length) {
        const delComment = await db.query(`DELETE FROM comments WHERE comment_id = $1;`, [commentId])
        return Promise.resolve();
    } else {
        return Promise.reject({status: 404, msg: 'Not Found'})
    }
}