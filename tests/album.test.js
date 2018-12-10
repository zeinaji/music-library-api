const mongoose = require('mongoose');

describe('Album', () => {
  let artistId;

  describe('POST /Artist/:artistId/album', () => {
    it('creates a new album record for a given artist', (done) => {
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
              expect(postAlbumResponse.status).to.equal(200);
              done();
            });
        });
    });

    it('gets artist record by id', (done) => {
      chai.request(server)
        .get(`/Artist/${artistId}`)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.status).to.equal(200);
          expect(res.body).to.have.all.keys('name', 'genre', '_id', '__v');
          expect(res.body.name).to.equal('Tame Impala');
          expect(res.body.genre).to.equal('Rock');
          done();
        });
    });
  });

  after(() => {
    const db = mongoose.connection;
    db.dropDatabase();
  });
});
