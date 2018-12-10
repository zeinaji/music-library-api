const mongoose = require('mongoose');

describe('Songs', () => {
  let artistId;
  let albumId;

  before((done) => {
    chai.request(server)
      .post('/Artist')
      .send({
        name: 'Tame Impala',
        genre: 'Rock',
      })
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(200);
        artistId = res.body._id;
        chai.request(server)
          .post(`/Artist/${artistId}/album`)
          .send({
            name: 'InnerSpeaker',
            year: 2010,
          }).end((postAlbumError, postAlbumResponse) => {
            expect(postAlbumError).to.equal(null);
            expect(postAlbumResponse.status).to.equal(200);
            albumId = postAlbumResponse.body._id;
            done();
          });
      });
  });

  describe('POST /album/:albumId/song', () => {
    it('creates a new song under an album', (done) => {
      chai.request(server)
        .post(`/Album/${albumId}/song`)
        .send({
          artistId: artistId,
          name: 'Solitude Is Bliss',
        })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.status).to.equal(200);
          const songId = res.body._id;
          expect(res.body).to.deep.equal({
            name: 'Solitude Is Bliss',
            _id: songId,
            artist:
           {
             _id: artistId,
             name: 'Tame Impala',
             genre: 'Rock',
             __v: 0,
           },
            album:
           {
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

  after((done) => {
    const db = mongoose.connection;
    db.dropDatabase(() => {
      done();
    });
  });
});
