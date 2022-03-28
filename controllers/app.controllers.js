const { getAllTopics } = require('../models/app.models');

exports.getTopics = async (req, res, next) => {
    try {
        const topics = await getAllTopics();
        res.status(200).send({topics});
    } catch(err) {
        next(err);
    }
}