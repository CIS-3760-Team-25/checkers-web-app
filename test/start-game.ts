require('dotenv').config();

import chai from 'chai';
import chaiHttp from 'chai-http';
import utils from './test-utils';
import { ErrorCode } from '../utils/enums';
import { Logger } from '../utils/log';

chai.use(chaiHttp);
chai.should();

const { APP_URL } = process.env;

const logger = Logger('Start Game Tests');

describe('Start Game', () => {
  describe('Record a New Game', () => {
    it('Should record a new game', (done) => {
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
          res.body.should.have.property('data', null);
          res.body.should.have.property('error', null);
          done();
        })
        .catch((err) => {
          done(err);
        })
        .finally(() => {
          utils.deleteGameRecord('dcab5f19-1499-40ad-bd12-1c64529475cc', logger);
        });
    });

    it('Should fail to record a game (missing gameId)', (done) => {
      chai
        .request(APP_URL)
        .post('/games')
        .send({
          playerOne: { name: 'lloyd', email: 'lloyd@email.com' },
          playerTwo: { name: 'clarence', email: 'clarence@email.com' },
        })
        .then((res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('data', null);
          res.body.should.have.property('error', ErrorCode.E001);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('Should fail to record a game (missing playerOne)', (done) => {
      chai
        .request(APP_URL)
        .post('/games')
        .send({
          gameId: 'dcab5f19-1499-40ad-bd12-1c64529475cc',
          playerTwo: { name: 'Guest', email: null },
        })
        .then((res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('data', null);
          res.body.should.have.property('error', ErrorCode.E001);
          done();
        })
        .catch((err) => {
          done(err);
        })
        .finally(() => {
          utils.deleteGameRecord('dcab5f19-1499-40ad-bd12-1c64529475cc', logger);
        });
    });

    it('Should fail to record a game (missing playerTwo)', (done) => {
      chai
        .request(APP_URL)
        .post('/games')
        .send({
          gameId: 'dcab5f19-1499-40ad-bd12-1c64529475cc',
          playerOne: { name: 'thomas', email: 'thomas@email.com' },
        })
        .then((res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('data', null);
          res.body.should.have.property('error', ErrorCode.E001);
          done();
        })
        .catch((err) => {
          done(err);
        })
        .finally(() => {
          utils.deleteGameRecord('dcab5f19-1499-40ad-bd12-1c64529475cc', logger);
        });
    });
  });
});
