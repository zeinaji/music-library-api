const express = require('express');
const artistControllers = require('./controllers/artists');
const albumControllers = require('./controllers/albums');
const songController = require('./controllers/song');

const app = express();

app.use(express.json());

app.post('/artists', artistControllers.create);

app.get('/artists', artistControllers.list);

app.get('/artists/:id', artistControllers.find);

app.patch('/artists/:id', artistControllers.patch);

app.delete('/artists/:id', artistControllers.delete);

app.post('/artists/:artistId/albums', albumControllers.create);

app.post('/album/:albumId/song', songController.postSong);

module.exports = app;
