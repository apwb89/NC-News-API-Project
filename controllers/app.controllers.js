const { fetchAllTopics, fetchAllUsernames, fetchArticleFromDbById, fetchAllArticles, fetchCommentsForArticle, sendCommentByArticleId, removeCommentById } = require('../models/app.models');


exports.getTopics = async (req, res, next) => {
    try {
        const topics = await fetchAllTopics();
        res.status(200).send({topics});
    } catch(err) {
        next(err);
    }
}

exports.getUsernames = async (req, res, next) => {
    try {
        const usernames = await fetchAllUsernames();
        res.status(200).send({usernames});
    } catch(err) {
        next(err);
    }
}


exports.getArticles = async (req, res, next) => {
    try {
        const articles = await fetchAllArticles();
        res.status(200).send({articles});
    } catch {
        next(err);
    }
}


exports.getArticleById = async (req, res, next) => {
    const { article_id } = req.params;
    try {
        const article = await fetchArticleFromDbById(article_id);
        res.status(200).send({article});
    } catch(err) {
        next(err);
    }
}

exports.getCommentsForArticleById = async (req, res, next) => {
    const { article_id } = req.params;
    try {
        const article =  await fetchArticleFromDbById(article_id);
        if(article) {
            const comments = await fetchCommentsForArticle(article_id);
                res.status(200).send({comments}); 
        }
    } catch(err) {
        next(err);
    }
}

exports.postCommentByArticleId = async (req, res, next) => {
    const { article_id } = req.params;
    const { name, body } = req.body;

    const article = await fetchArticleFromDbById(article_id);
    if(article) {
        const post = await sendCommentByArticleId(article_id, name, body);
            res.status(200).send({post});
    }

}

exports.deleteCommentById = async (req, res, next) => {
    const { comment_id } = req.params;
    try {
        const delComment = await removeCommentById(comment_id);
        res.status(204).send({});
    } catch(err) {
        next(err);
    }
}

