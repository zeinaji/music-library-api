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
              const artist = postAlbumResponse.body.artist;
              expect(artist).to.deep.equal({
                _id: artistId,
                name: 'Tame Impala',
                genre: 'Rock',
                __v: 0,
              });
              expect(postAlbumResponse.body.name).to.equal('InnerSpeaker');
              expect(postAlbumResponse.body.year).to.equal(2010);
              expect();
              done();
            });
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
