const mongoose = require('mongoose');

describe('/Artist', () => {
  let artistId;

  describe('POST /artist', () => {
    it('creates a new artist record', (done) => {
      chai.request(server)
        .post('/Artist')
        .send({
          name: 'Tame Impala',
          genre: 'Rock',
        })
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

  describe('GET /artist', () => {
    it('gets created artist record', (done) => {
      chai.request(server)
        .get('/Artist')
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.status).to.equal(200);
          const results = res.body;
          expect(results).to.have.lengthOf(1);
          const artist = results[0];
          expect(artist).to.have.all.keys('name', 'genre', '_id', '__v');
          expect(artist.name).to.equal('Tame Impala');
          expect(artist.genre).to.equal('Rock');
          artistId = artist._id;
          done();
        });
    });
  });

  describe('GET /artist/:artistId', () => {
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

  describe('PUT /artist/:artistId', () => {
    it('updates artist record by id', (done) => {
      chai.request(server)
        .put(`/Artist/${artistId}`)
        .send({ genre: 'Psychedelic Rock' })
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.status).to.equal(200);
          expect(res.body).to.have.all.keys('genre', '_id', '__v');
          expect(res.body.genre).to.equal('Psychedelic Rock');
          expect(res.body._id).to.equal(artistId);
          done();
        });
    });
  });

  describe('Delete /artist/:artistId', () => {
    it('deletes artist record by id', (done) => {
      chai.request(server)
        .delete(`/Artist/${artistId}`)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res.status).to.equal(200);
          chai.request(server)
            .get('/Artist')
            .end((errorGetArtist, responseGetArtist) => {
              expect(errorGetArtist).to.equal(null);
              expect(responseGetArtist.status).to.equal(200);
              const results = responseGetArtist.body;
              expect(results).to.have.lengthOf(0);
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
