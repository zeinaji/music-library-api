const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  name: String,
  year: Number,
  artist: { type: mongoose.Schema.ObjectId, ref: 'Artist' },
  songs: [{ type: mongoose.Schema.ObjectId, ref: 'Song' }],
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
