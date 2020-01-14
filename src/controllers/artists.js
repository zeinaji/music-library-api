const Artist = require('../models/artist');

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
  Artist.find({}).then(artists => res.json(artists));
};

exports.find = (req, res) => {
  // this is the controller you wrote in the first part of this step
  Artist.findOne({ _id: req.params.id }, (_, artist) => {
    if (!artist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      res.status(200).json(artist);
    }
  });
};

exports.patch = (req, res) => {
  // this is the controller you wrote in the first part of this step
  Artist.findOne({ _id: req.params.id }, (_, artist) => {
    if (!artist) {
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
  Artist.findOne({ _id: req.params.id }, (_, artist) => {
    if (!artist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      artist.remove().then(() => {
        res.status(204).send();
      });
    }
  });
};
