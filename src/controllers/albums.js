const Artist = require('../models/artist');
const Album = require('../models/album');

exports.create = (req, res) => {
  const { artistId } = req.params;

  Artist.findOne({ _id: artistId }, (err, artist) => {
    if (!artist) {
      res.status(404).json({ error: 'The artist could not be found.' });
    } else {
      const album = new Album({ ...req.body, artist: artistId });

      album.save().then(() => {
        res.status(201).json(album);
      });
    }
  });
};
