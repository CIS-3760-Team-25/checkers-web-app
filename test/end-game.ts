require('dotenv').config();

import chai from 'chai';
import chaiHttp from 'chai-http';
import utils from './test-utils';
import ErrorCodes from '../utils/error-codes';
import { Logger } from '../utils/log';

chai.use(chaiHttp);
chai.should();

const { APP_URL } = process.env;

const logger = Logger('End Game Tests');

describe('End Game', () => {
  describe('Update an Existing Game', () => {
    it('Should update a game record (draw)', (done) => {
      chai
        .request(APP_URL)
        .post('/games')
        .send({
          gameId: '923a41f8-5118-4b3f-a924-fa55a46fbc78',
          playerOne: { name: 'Guest', email: null },
          playerTwo: { name: 'Guest', email: null },
        })
        .then((res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('data', null);
          res.body.should.have.property('error', null);

          chai
            .request(APP_URL)
            .put('/games')
            .send({
              gameId: '923a41f8-5118-4b3f-a924-fa55a46fbc78',
              outcome: 'draw',
              playerOneCaptures: 4,
              playerTwoCaptures: 6,
            })
            .then((res1) => {
              res1.should.have.status(200);
              res1.body.should.be.a('object');
              res1.body.should.have.property('data', null);
              res1.body.should.have.property('error', null);
              done();
            })
            .catch((err) => {
              done(err);
            })
            .finally(() => {
              utils.deleteGameRecord('923a41f8-5118-4b3f-a924-fa55a46fbc78', logger);
            });
        })
        .catch((err) => {
          done(err);
        });
    });

    it('Should update a game record (player one wins)', (done) => {
      chai
        .request(APP_URL)
        .post('/games')
        .send({
          gameId: '850844a6-5486-41ea-84ba-08f2c0683847',
          playerOne: { name: 'Guest', email: null },
          playerTwo: { name: 'Guest', email: null },
        })
        .then((res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('data', null);
          res.body.should.have.property('error', null);

          chai
            .request(APP_URL)
            .put('/games')
            .send({
              gameId: '850844a6-5486-41ea-84ba-08f2c0683847',
              outcome: 'player_one_win',
              playerOneCaptures: 1,
              playerTwoCaptures: 7,
            })
            .then((res1) => {
              res1.should.have.status(200);
              res1.body.should.be.a('object');
              res1.body.should.have.property('data', null);
              res1.body.should.have.property('error', null);
              done();
            })
            .catch((err) => {
              done(err);
            })
            .finally(() => {
              utils.deleteGameRecord('850844a6-5486-41ea-84ba-08f2c0683847', logger);
            });
        })
        .catch((err) => {
          done(err);
        });
    });

    it("Should fail to update a game record (game doesn't exist)", (done) => {
      chai
        .request(APP_URL)
        .put('/games')
        .send({
          gameId: 'b60836f3-ae06-48ee-8bf6-ae73929c4757',
          outcome: 'player_two_win',
          playerOneCaptures: 7,
          playerTwoCaptures: 5,
        })
        .then((res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('data', null);
          res.body.should.have.property('error', ErrorCodes.E004);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('Should fail to update a game record (missing gameId)', (done) => {
      chai
        .request(APP_URL)
        .put('/games')
        .send({
          outcome: 'draw',
          playerOneCaptures: 8,
          playerTwoCaptures: 3,
        })
        .then((res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('data', null);
          res.body.should.have.property('error', ErrorCodes.E002);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('Should fail to update a game record (missing outcome)', (done) => {
      chai
        .request(APP_URL)
        .put('/games')
        .send({
          gameId: 'b60836f3-ae06-48ee-8bf6-ae73929c4757',
          playerOneCaptures: 4,
          playerTwoCaptures: 9,
        })
        .then((res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('data', null);
          res.body.should.have.property('error', ErrorCodes.E002);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('Should fail to update a game record (missing playerOneCaptures)', (done) => {
      chai
        .request(APP_URL)
        .put('/games')
        .send({
          gameId: 'b60836f3-ae06-48ee-8bf6-ae73929c4757',
          playerTwoCaptures: 0,
        })
        .then((res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('data', null);
          res.body.should.have.property('error', ErrorCodes.E002);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('Should fail to update a game record (missing playerTwoCaptures)', (done) => {
      chai
        .request(APP_URL)
        .put('/games')
        .send({
          gameId: 'b60836f3-ae06-48ee-8bf6-ae73929c4757',
          playerOneCaptures: 0,
        })
        .then((res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('data', null);
          res.body.should.have.property('error', ErrorCodes.E002);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
