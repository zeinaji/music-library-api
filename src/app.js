const express = require('express');
const artistsController = require('./controllers/artists');
const albumsController = require('./controllers/albums');
const songsController = require('./controllers/songs');

const app = express();
app.use(express.json());

app.post('/artists', artistsController.create);

app.get('/artists', artistsController.list);

app.get('/artists/:artistId', artistsController.getById);

app.patch('/artists/:artistId', artistsController.patch);

app.delete('/artists/:artistId', artistsController.delete);

app.post('/artists/:artistId/albums', albumsController.create);

app.get('/artists/:artistId/albums', albumsController.list);

app.get('/albums/:albumId', albumsController.getById);

app.patch('/albums/:albumId', albumsController.update);

app.delete('/albums/:albumId', albumsController.delete);

app.post('/album/:albumId/song', songsController.create);

module.exports = app;
