require('dotenv').config();

import chai from 'chai';
import chaiHttp from 'chai-http';
import db from '../src/utils/db';

chai.use(chaiHttp);
chai.should();

const { APP_URL } = process.env;

describe('Games', () => {
  beforeEach(() => {
    db.query('DELETE FROM game WHERE id=$1', [
      'dcab5f19-1499-40ad-bd12-1c64529475cc',
    ]).catch((err) => console.log(err));
  });

  describe('Start New Game', () => {
    it('Should start a game', (done) => {
      chai
        .request(APP_URL)
        .post('/games')
        .send({
          gameId: 'dcab5f19-1499-40ad-bd12-1c64529475cc',
          playerOne: { name: 'Guest', email: null },
          playerTwo: { name: 'Clarence', email: 'clarence@email.com' },
        })
        .then((res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('Should fail to start a game', (done) => {
      chai
        .request(APP_URL)
        .post('/games')
        .send({
          playerOne: { name: 'Guest', email: null },
          playerTwo: { name: 'Clarence', email: 'clarence@email.com' },
        })
        .then((res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    // Test to get all students record
    // it('should get all students record', (done) => {
    //   chai
    //     .request(APP_URL)
    //     .get('/')
    //     .end((err, res) => {
    //       res.should.have.status(200);
    //       res.body.should.be.a('object');
    //       done();
    //     });
    // });
  });
});
