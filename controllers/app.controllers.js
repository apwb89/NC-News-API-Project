const {
  fetchAllTopics,
  fetchAllUsernames,
  fetchArticleFromDbById,
  fetchAllArticles,
  fetchCommentsForArticle,
  sendCommentByArticleId,
  removeCommentById,
  checkUserExistsByName,
} = require("../models/app.models");

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
    const articles = await fetchAllArticles();
    res.status(200).send({ articles });
  } catch {
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
    const article = await fetchArticleFromDbById(article_id);
    if (article) {
      const comments = await fetchCommentsForArticle(article_id);
      res.status(200).send({ comments });
    }
  } catch (err) {
    next(err);
  }
};

exports.postCommentByArticleId = async (req, res, next) => {
    if(!req.body.name || !req.body.body || typeof req.body.name !== 'string' || typeof req.body.body !== 'string') {
         return next({status: 400, msg: 'Bad Request'})
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

exports.deleteCommentById = async (req, res, next) => {
  const { comment_id } = req.params;
  try {
    const delComment = await removeCommentById(comment_id);
    res.status(204).send({});
  } catch (err) {
    next(err);
  }
};
