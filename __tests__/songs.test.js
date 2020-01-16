const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Artist = require('../src/models/artist');
const Album = require('../src/models/album');
const Song = require('../src/models/song');

describe('Songs', () => {
  let artistId;
  let albumId;

  beforeAll(done => {
    const url = process.env.DATABASE_CONN;
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    done();
  });

  beforeEach(done => {
    request(app)
      .post('/artists')
      .send({
        name: 'Tame Impala',
        genre: 'Rock',
      })
      .then(res => {
        expect(res.status).toBe(200);
        artistId = res.body._id;
        request(app)
          .post(`/artists/${artistId}/album`)
          .send({
            name: 'InnerSpeaker',
            year: 2010,
          })
          .then((postAlbumError, postAlbumResponse) => {
            expect(postAlbumError).toBe(null);
            expect(postAlbumResponse.status).toBe(200);
            albumId = postAlbumResponse.body._id;
            done();
          });
      });
  });

  afterEach(done => {
    Artist.deleteMany({}, () => {
      Album.deleteMany({}, () => {
        Song.deleteMany({}, () => {
          done();
        });
      });
    });
  });

  afterAll(done => {
    mongoose.connection.close();
    done();
  });

  describe('POST /album/:albumId/song', () => {
    it('creates a new song under an album', done => {
      request(app)
        .post(`/album/${albumId}/song`)
        .send({
          artistId,
          name: 'Solitude Is Bliss',
        })
        .then(res => {
          expect(res.status).toBe(200);
          const songId = res.body._id;
          expect(res.body).to.deep.equal({
            name: 'Solitude Is Bliss',
            _id: songId,
            artist: {
              _id: artistId,
              name: 'Tame Impala',
              genre: 'Rock',
              __v: 0,
            },
            album: {
              _id: albumId,
              artist: artistId,
              name: 'InnerSpeaker',
              year: 2010,
              __v: 0,
            },
            __v: 0,
          });
          done();
        });
    });
  });
});
