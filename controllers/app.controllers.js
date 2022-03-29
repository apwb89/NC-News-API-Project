const { getAllTopics, getAllUsernames, getAllArticles, getArticleCommentCountsLookupObj } = require('../models/app.models');

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

