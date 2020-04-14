const express = require('express');
const artistsController = require('./controllers/artists');

const app = express();
app.use(express.json());

app.post('/artists', artistsController.create);

app.get('/artists', artistsController.list);

app.get('/artists/:artistId', artistsController.getById);

app.patch('/artists/:artistId', artistsController.patch);

app.delete('/artists/:artistId', artistsController.delete);

module.exports = app;
