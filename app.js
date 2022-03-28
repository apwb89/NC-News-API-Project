const express = require('express');
const app = express();

const { getTopics } = require('./controllers/app.controllers')

app.use(express.json());

app.get('/api/topics', getTopics);

app.all('*', (req, res) => {
    res.status(404).send({msg: 'Not Found'})
})

app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error' });
});

module.exports = app;