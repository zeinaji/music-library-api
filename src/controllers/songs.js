const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');

exports.create = (req, res) => {
  const { albumId } = req.params;
  Album.findById(albumId, (err, album) => {
    if (err) {
      res.status(404).json({ error: 'The album could not be found.' });
    } else {
      const song = new Song({
        name: req.body.name,
        artist: req.body.artistId,
        album: albumId,
      });
      album.songs.push(song);
      album.save();

      Artist.findById(song.artist, (_, artist) => {
        artist.songs.push(song);
        artist.save();
      });

      song.save().then(() => {
        Song.findOne({ _id: song.id })
          .populate('artist')
          .populate('album')
          .exec((_, song) => {
            res.status(200).json(song);
          });
      });
    }
  });
};
