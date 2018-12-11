const mongoose = require('mongoose');

describe('Get All Albums', () => {
  let artistId;

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
            chai.request(server)
              .post(`/Artist/${artistId}/album`)
              .send({
                name: 'Currents',
                year: 2015,
              }).end((postAlbumError2, postAlbumResponse2) => {
                expect(postAlbumError2).to.equal(null);
                expect(postAlbumResponse2.status).to.equal(200);
                done();
              });
          });
      });
  });

  describe('Get /artist/:artistId/albums', () => {
    it('returns all albums by artist', (done) => {
      chai.request(server)
        .get(`/artist/${artistId}/albums`)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.status).to.equal(200);
          expect(res.body[0].name).to.equal('InnerSpeaker');
          expect(res.body[0].year).to.equal(2010);
          expect(res.body[1].name).to.equal('Currents');
          expect(res.body[1].year).to.equal(2015);
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
