const express = require('express');
const app = express();

const { getTopics, getUsernames, getArticleById } = require('./controllers/app.controllers')

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/users', getUsernames);

app.get('/api/article/:article_id', getArticleById);

app.all('*', (req, res) => {
    res.status(404).send({msg: 'Not Found'})
})

app.use((err, req, res, next) => {
    if(err.msg && err.status === 404) {
        res.status(404).send({msg: err.msg})
    } else {
        next(err);
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error' });
});

module.exports = app;