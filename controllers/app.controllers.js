const {
  fetchAllTopics,
  fetchAllUsernames,
  fetchUserByUsername,
  fetchArticleFromDbById,
  fetchAllArticles,
  createArticle,
  fetchCommentsForArticle,
  removeArticleById,
  sendCommentByArticleId,
  updateCommentVotesByNum,
  removeCommentById,
  checkUserExistsByName,
  updateArticleVotes,
  fetchAPIInfo,
  sendTopic,
} = require('../models/app.models');

exports.getAPIInfo = async (req, res, next) => {
  try {
    const apiInfo = await fetchAPIInfo();
    const parsedInfo = JSON.parse(apiInfo, null, 2);
    res.status(200).send({ endpoints: parsedInfo });
  } catch (err) {
    next(err);
  }
};

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await fetchAllTopics();
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};

exports.postTopic = async (req, res, next) => {
  try {
    if (
      !req.body.slug ||
      !req.body.description ||
      typeof req.body.slug !== 'string' ||
      typeof req.body.description !== 'string'
    ) {
      return next({ status: 400, msg: 'Bad Request' });
    }

    const { slug, description } = req.body;
    const newTopic = await sendTopic(slug, description);
    res.status(201).send({ topic: newTopic });
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

exports.getUserByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await fetchUserByUsername(username);
    res.status(200).send({ user });
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

exports.postArticle = async (req, res, next) => {
  try {
    if (
      !req.body.author ||
      !req.body.title ||
      !req.body.body ||
      !req.body.topic ||
      typeof req.body.author !== 'string' ||
      typeof req.body.title !== 'string' ||
      typeof req.body.body !== 'string' ||
      typeof req.body.topic !== 'string'
    ) {
      return next({ status: 400, msg: 'Bad Request' });
    }

    const { author, title, body, topic } = req.body;
    const topics = await fetchAllTopics();
    await fetchUserByUsername(author)
    
    if(!topics.map(x => x.slug).includes(topic)) {
      return next({status: 404, msg: "Not Found"})
    } else {
      const newArticle = await createArticle(author, title, body, topic);
      res.status(201).send({ article: newArticle });
    }
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

exports.patchArticleVotesByNum = async (req, res, next) => {
  try {
    if (!req.body.inc_votes || typeof req.body.inc_votes !== 'number') {
      return next({ status: 400, msg: 'Bad Request' });
    }

    const { article_id } = req.params;
    const { inc_votes } = req.body;

    const votedArticle = await updateArticleVotes(article_id, inc_votes);
    res.status(200).send({ article: votedArticle });
  } catch (err) {
    next(err);
  }
};

exports.deleteArticleById = async (req, res, next) => {
  const { article_id } = req.params;
  try {
    const delArticle = await removeArticleById(article_id);
    res.status(204).send({});
  } catch (err) {
    next(err);
  }
};

exports.patchCommentVotesByNum = async (req, res, next) => {
  try {
    if (!req.body.inc_votes || typeof req.body.inc_votes !== 'number') {
      return next({ status: 400, msg: 'Bad Request' });
    } else {
      const { comment_id } = req.params;
      const { inc_votes } = req.body;

      const patchedComment = await updateCommentVotesByNum(
        comment_id,
        inc_votes
      );
      res.status(200).send({ comment: patchedComment });
    }
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
