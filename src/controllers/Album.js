const Artist = require('../models/Artist');
const Album = require('../models/Album');

exports.postAlbum = (req, res) => {
  /* start after refactor */
  Artist.findById(req.params.artistId, (err, artist) => {
    if (err) {
      res.json('Artist does not exist');
    }

    const myAlbum = new Album({
      artist,
      name: req.body.name,
      year: req.body.year,
    });

    myAlbum.save((createErr, createdAlbum) => {
      if (createErr) {
        res.json('Could not create an album');
      }

      res.json(createdAlbum);
    });
  });
  /* end after refactor */
  /* before refactor
  Artist.findById(req.params.artistId, (err, artist) => {
    if (err) {
      res.json('Something went wrong');
    }

    artist.set({ albums: artist.albums.concat([req.body]) });

    artist.save((updateErr, artistUpdated) => {
      if (updateErr) {
        res.json('Could not update');
      }

      res.json(artistUpdated);
    });
  });
  */
};
