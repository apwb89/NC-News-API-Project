const {
  fetchAllTopics,
  fetchAllUsernames,
  fetchArticleFromDbById,
  fetchAllArticles,
  fetchCommentsForArticle,
  sendCommentByArticleId,
  removeCommentById,
  checkUserExistsByName,
  updateVotes,
  fetchAPIInfo
} = require('../models/app.models');


exports.getAPIInfo = async (req, res, next) => {
  try {
    const apiInfo = await fetchAPIInfo();
    const parsedInfo = JSON.parse(apiInfo, null, 2);
    res.status(200).send({endpoints: parsedInfo})
  } catch(err) {
    next(err);
  }
}

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await fetchAllTopics();
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};

exports.getUsernames = async (req, res, next) => {
  try {
    const usernames = await fetchAllUsernames();
    res.status(200).send({ usernames });
  } catch (err) {
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  try {
    const { sort_by, order, topic } = req.query;

    if (order) {
      const validOrders = ['ASC', 'ASCENDING', 'DESC', 'DESCENDING'];
      if (!validOrders.includes(order))
        return next({ status: 400, msg: 'Bad Request' });
    }

    const articles = await fetchAllArticles(sort_by, order, topic);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.getArticleById = async (req, res, next) => {
  const { article_id } = req.params;
  try {
    const article = await fetchArticleFromDbById(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getCommentsForArticleById = async (req, res, next) => {
  const { article_id } = req.params;
  try {
    await fetchArticleFromDbById(article_id);

    const comments = await fetchCommentsForArticle(article_id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postCommentByArticleId = async (req, res, next) => {
  if (
    !req.body.name ||
    !req.body.body ||
    typeof req.body.name !== 'string' ||
    typeof req.body.body !== 'string'
  ) {
    return next({ status: 400, msg: 'Bad Request' });
  }

  const { name, body } = req.body;
  const { article_id } = req.params;

  const checkArticleExists = fetchArticleFromDbById(article_id);
  const checkUser = checkUserExistsByName(name);

  return Promise.all([checkArticleExists, checkUser, article_id, name, body])
    .then((response) => {
      const article_id = response[2];
      const name = response[3];
      const body = response[4];

      sendCommentByArticleId(article_id, name, body).then((response) => {
        res.status(200).send({ comment: response[0] });
      });
    })
    .catch(next);
};

exports.patchVotesByNum = async (req, res, next) => {
  try {
    if (!req.body.inc_votes || typeof req.body.inc_votes !== 'number') {
      return next({ status: 400, msg: 'Bad Request' });
    }

    const { article_id } = req.params;
    const { inc_votes } = req.body;

    const votedArticle = await updateVotes(article_id, inc_votes);
    res.status(200).send({ article: votedArticle });
  } catch (err) {
    next(err);
  }
};

exports.deleteCommentById = async (req, res, next) => {
  const { comment_id } = req.params;
  try {
    const delComment = await removeCommentById(comment_id);
    res.status(204).send({});
  } catch (err) {
    next(err);
  }
};
