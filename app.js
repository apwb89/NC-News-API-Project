const express = require('express');
const app = express();

const {
  getTopics,
  getUsernames,
  getArticles,
  getArticleById,
  getCommentsForArticleById,
  postCommentByArticleId,
  deleteCommentById,
  patchVotesByNum,
  getAPIInfo,
  postTopic
} = require('./controllers/app.controllers');

app.use(express.json());

app.get('/api', getAPIInfo);

app.get('/api/topics', getTopics);

app.post('/api/topics', postTopic);

app.get('/api/users', getUsernames);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.patch('/api/articles/:article_id', patchVotesByNum);

app.get('/api/articles/:article_id/comments', getCommentsForArticleById);

app.post('/api/articles/:article_id/comments', postCommentByArticleId);

app.delete('/api/comments/:comment_id', deleteCommentById);

app.all('*', (req, res) => {
  res.status(404).send({ msg: 'Not Found' });
});

//code errors
app.use((err, req, res, next) => {
  const errorCodes = ['22P02'];
  if (errorCodes.includes(err.code)) {
    res.status(400).send({ msg: 'Bad Request' });
  } else {
    next(err);
  }
});

//custom errors
app.use((err, req, res, next) => {
  if (err.msg && err.status === 404) {
    res.status(404).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.msg && err.status === 400) {
    res.status(400).send({ msg: err.msg });
  } else {
    next(err);
  }
});

//default server error
app.use((err, req, res, next) => {
  console.log(err, '<<<<<<<<<<<<<<<<<<<<<<< err');
  res.status(500).send({ msg: 'Internal Server Error' });
});

module.exports = app;
