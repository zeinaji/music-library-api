const Album = require('../models/album');
const Artist = require('../models/artist');

exports.create = (req, res) => {
  const id = req.params.artistId;
  Artist.findById(id, (err, artist) => {
    if (err) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      const album = new Album({
        name: req.body.name,
        year: req.body.year,
        artist: artist._id,
      });

      album.save().then(() => {
        res.status(201).json(album);
      });

      artist.albums.push(album);
      artist.save();
    }
  });
};

exports.list = (req, res) => {
  const id = req.params.artistId;
  Artist.findById(id, (err, artist) => {
    if (err) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      res.status(200).json(artist.albums);
    }
  });
};

exports.getById = (req, res) => {
  const id = req.params.albumId;
  Album.findById(id).exec((err, album) => {
    if (err) {
      res.status(404).json({ error: 'The album could not be found.' });
    } else {
      res.status(200).json(album);
    }
  });
};

exports.update = (req, res) => {
  const id = req.params.albumId;
  Album.findOne({ _id: id }, (err, album) => {
    if (err) {
      res.status(404).json({ error: 'The album could not be found.' });
    } else {
      album.set(req.body);
      album.save().then(updatedAlbum => {
        res.status(200).json(updatedAlbum);
      });
    }
  });
};

exports.delete = (req, res) => {
  const id = req.params.albumId;
  Album.findByIdAndDelete(id, (err, result) => {
    if (err) {
      res.status(404).json({ error: 'The album could not be found.' });
    } else {
      res.status(204).json({ message: 'The album has been deleted.' });
    }
  });
};
