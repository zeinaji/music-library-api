const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Artist = require('../src/models/artist');
const Album = require('../src/models/album');

describe('/albums', () => {
  let artist;

  beforeAll(done => {
    const url = process.env.DATABASE_CONN;
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    done();
  });

  beforeEach(done => {
    Artist.create(
      {
        name: 'Tame Impala',
        genre: 'Rock',
      },
      (_, document) => {
        artist = document;
        done();
      },
    );
  });

  afterEach(done => {
    Artist.deleteMany({}, () => {
      Album.deleteMany({}, () => {
        done();
      });
    });
  });

  afterAll(done => {
    mongoose.connection.db.dropDatabase();
    mongoose.connection.close();
    done();
  });

  describe('POST /artists/:artistId/albums', () => {
    it('creates a new album for a given artist', done => {
      request(app)
        .post(`/artists/${artist._id}/albums`)
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then(res => {
          expect(res.status).toBe(201);

          Album.findById(res.body._id, (err, album) => {
            expect(err).toBe(null);
            expect(album.name).toBe('InnerSpeaker');
            expect(album.year).toBe(2010);
            expect(album.artist).toEqual(artist._id);

            Artist.findById(artist._id, (err, artist) => {
              expect(err).toBe(null);
              expect(artist.albums[0]).toEqual(album._id);
            });
            done();
          });
        });
    });

    it('returns a 404 and does not create an album if the artist does not exist', done => {
      request(app)
        .post('/artists/1234/albums')
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then(res => {
          expect(res.status).toBe(404);
          expect(res.body.error).toBe('The artist could not be found.');

          Album.find({}, (err, albums) => {
            expect(err).toBe(null);
            expect(albums.length).toBe(0);
            done();
          });
        });
    });
  });

  describe('with albums in the database', () => {
    let albums;
    beforeEach(done => {
      Promise.all([
        Album.create({ name: 'The Slow Rush', year: 2020, artist: artist._id }),
        Album.create({ name: 'Currents', year: 2015, artist: artist._id }),
        Album.create({ name: 'Lonerims', year: 2014, artist: artist._id }),
      ]).then(documents => {
        albums = documents;
        albums.forEach(a => {
          artist.albums.push(a);
        });
        artist.save();
        done();
      });
    });

    describe('GET/artists/:artistId/albums', () => {
      it('gets all the artists albums records', done => {
        request(app)
          .get(`/artists/${artist._id}/albums`)
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);

            res.body.forEach(albumId => {
              Album.findById(albumId, (_, album) => {
                const expected = albums.find(a => a._id.toString() === albumId);
                expect(album.name).toBe(expected.name);
                expect(album.year).toBe(expected.year);
              });
            });
            done();
          });
      });
    });

    describe('GET/albums/:albumId', () => {
      it('gets albums record by id', done => {
        const album = albums[0];
        request(app)
          .get(`/albums/${album._id}`)
          .then(res => {
            expect(res.status).toBe(200);
            expect(res.body.name).toBe(album.name);
            expect(res.body.year).toBe(album.year);
            expect(res.body.artist).toBe(album.artist._id.toString());
            done();
          });
      });

      it('returns a 404 if the album does not exist', done => {
        request(app)
          .get('/albums/12345')
          .then(res => {
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('The album could not be found.');
            done();
          });
      });
    });

    describe('PATCH/albums/:albumId', () => {
      it('updates album year by id', done => {
        const album = albums[0];
        request(app)
          .patch(`/albums/${album._id}`)
          .send({ year: 2021 })
          .then(res => {
            expect(res.status).toBe(200);
            Album.findById(album._id, (_, updatedAlbum) => {
              expect(updatedAlbum.year).toBe(2021);
              done();
            });
          });
      });

      it('returns a 404 if the album does not exist', done => {
        request(app)
          .patch('/albums/12345')
          .send({ year: 2021 })
          .then(res => {
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('The album could not be found.');
            done();
          });
      });
    });

    describe('DELETE /albums/:albumId', () => {
      it('deletes album record by id', done => {
        const album = albums[1];
        request(app)
          .delete(`/albums/${album._id}`)
          .then(res => {
            expect(res.status).toBe(204);
            Album.findById(album._id, (error, updatedAlbum) => {
              expect(error).toBe(null);
              expect(updatedAlbum).toBe(null);
              done();
            });
          });
      });

      it('returns a 404 if the artist does not exist', done => {
        request(app)
          .delete('/albums/12345')
          .then(res => {
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('The album could not be found.');
            done();
          });
      });
    });
  });
});
