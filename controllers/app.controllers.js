const { getAllTopics } = require('../models/app.models');

exports.getTopics = (req, res, next) => {
    getAllTopics().then((topics) => {
        res.status(200).send({topics});
    }).catch(next)
}