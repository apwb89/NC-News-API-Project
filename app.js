const express = require('express');
const app = express();

const { getTopics, getUsernames, getArticles } = require('./controllers/app.controllers')

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/users', getUsernames);

app.get('/api/articles', getArticles);

app.all('*', (req, res) => {
    res.status(404).send({msg: 'Not Found'})
})

app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error' });
});

module.exports = app;