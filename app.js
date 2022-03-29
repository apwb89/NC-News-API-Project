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

//code errors
app.use((err, req, res, next) => {
    const errorCodes = ['22P02'];
    if (errorCodes.includes(err.code)) {
        res.status(400).send({msg: 'Bad Request'})
    } else {
       next(err); 
    }
})

//custom errors
app.use((err, req, res, next) => {
    if(err.msg && err.status === 404) {
        res.status(404).send({msg: err.msg})
    } else {
        next(err);
    }
})

//default server error
app.use((err, req, res, next) => {
    console.log(err, '<<<<<<<<<<<<<<<<<<<<<<< err')
    res.status(500).send({ msg: 'Internal Server Error' });
});

module.exports = app;