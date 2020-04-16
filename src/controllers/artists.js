const Artist = require('../models/artist');
const Album = require('../models/album');

exports.create = (req, res) => {
  const artist = new Artist({
    name: req.body.name,
    genre: req.body.genre,
  });

  artist.save().then(() => {
    res.status(201).json(artist);
  });
};

exports.list = (req, res) => {
  Artist.find().then(artists => {
    res.status(200).json(artists);
  });
};

exports.getById = (req, res) => {
  const id = req.params.artistId;
  Artist.findById(id).exec((err, artist) => {
    if (!artist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      res.status(200).json(artist);
    }
  });
};

exports.patch = (req, res) => {
  const id = req.params.artistId;
  Artist.findOne({ _id: id }, (err, artist) => {
    if (err) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      artist.set(req.body);
      artist.save().then(updatedArtist => {
        res.status(200).json(updatedArtist);
      });
    }
  });
};

exports.delete = (req, res) => {
  const id = req.params.artistId;
  Artist.findByIdAndDelete(id, (err, result) => {
    if (err) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      res.status(204).json({ message: 'The artist has been deleted.' });
    }
  });
};
