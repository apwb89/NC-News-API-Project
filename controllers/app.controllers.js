const { getAllTopics, getAllUsernames, getArticleFromDbById, getAllArticles, getCommentsForArticle } = require('../models/app.models');


exports.getTopics = async (req, res, next) => {
    try {
        const topics = await getAllTopics();
        res.status(200).send({topics});
    } catch(err) {
        next(err);
    }
}

exports.getUsernames = async (req, res, next) => {
    try {
        const usernames = await getAllUsernames();
        res.status(200).send({usernames});
    } catch(err) {
        next(err);
    }
}


exports.getArticles = async (req, res, next) => {
    try {
        const articles = await getAllArticles();
        res.status(200).send({articles});
    } catch {
        next(err);
    }
}


exports.getArticleById = async (req, res, next) => {
    const { article_id } = req.params;
    try {
        const article = await getArticleFromDbById(article_id);
        res.status(200).send({article});
    } catch(err) {
        next(err);
    }
}

exports.getCommentsForArticleById = async (req, res, next) => {
    const { article_id } = req.params;
    try {
        const article =  await getArticleFromDbById(article_id);
        if(article) {
            const comments = await getCommentsForArticle(article_id);
            if(comments.length) {
                res.status(200).send({comments});
            } else {
                res.status(204).send()
            }
        }
    } catch(err) {
        next(err);
    }
}

