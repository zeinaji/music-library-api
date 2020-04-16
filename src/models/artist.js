const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: String,
  genre: String,
  albums: [{ type: mongoose.Schema.ObjectId, ref: 'Album' }],
  songs: [{ type: mongoose.Schema.ObjectId, ref: 'Song' }],
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
