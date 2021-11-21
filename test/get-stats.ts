require('dotenv').config();

import chai from 'chai';
import chaiHttp from 'chai-http';
import { v4 as uuid } from 'uuid';
import utils from './test-utils';
import { ErrorCode, GameOutcome } from '../utils/enums';
import { Logger } from '../utils/log';

chai.use(chaiHttp);
chai.should();

const { APP_URL } = process.env;

const logger = Logger('Player Stats Tests');

describe('Get Player Statisticss', () => {
  const testGameCount = 5;
  const testGames = [];

  before(() => {
    const getRandomInt = (max) => Math.floor(Math.random() * max);

    for (let i = 0; i < testGameCount; i++) {
      const gameId = uuid();
      const isPlayerOne = getRandomInt(2) === 0;

      const players = {
        test: { name: 'Test', email: 'test@email.com' },
        guest: { name: 'Guest', email: null },
      };

      const outcomes = [
        GameOutcome.INCOMPLETE,
        GameOutcome.PLAYER_ONE_WIN,
        GameOutcome.PLAYER_TWO_WIN,
        GameOutcome.DRAW,
      ];

      const gameData = {
        record: {
          gameId,
          playerOne: isPlayerOne ? players.test : players.guest,
          playerTwo: isPlayerOne ? players.guest : players.test,
        },
        outcome: {
          gameId,
          outcome: outcomes[getRandomInt(4)],
          playerOneCaptures: getRandomInt(13),
          playerTwoCaptures: getRandomInt(13),
        },
      };

      testGames.push(gameData);

      chai
        .request(APP_URL)
        .post('/games')
        .send(gameData.record)
        .then((res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('data', null);
          res.body.should.have.property('error', null);

          if (gameData.outcome.outcome !== GameOutcome.INCOMPLETE) {
            chai
              .request(APP_URL)
              .put('/games')
              .send(gameData.outcome)
              .then((outcomeRes) => {
                outcomeRes.should.have.status(200);
                outcomeRes.body.should.be.a('object');
                outcomeRes.body.should.have.property('data', null);
                outcomeRes.body.should.have.property('error', null);
              })
              .catch((err) => {
                logger.error(`Failed to load test game outcome: ${err}`);
              });
          }
        })
        .catch((err) => {
          logger.error(`Failed to load test game recore: ${err}`);
        });
    }
  });

  after(() => {
    testGames.forEach((game) => {
      utils.deleteGameRecord(game.record.gameId, logger);
    });
  });

  describe('Get Stats by Email', () => {
    it('Should get stats for a given email', (done) => {
      chai
        .request(APP_URL)
        .get('/stats?email=test@email.com')
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.have.property('stats');
          res.body.data.stats.should.have.property('gamesPlayed', testGameCount);
          res.body.data.stats.should.have.property('wins').to.not.equal(null).to.be.a('number');
          res.body.data.stats.should.have.property('draws').to.not.equal(null).to.be.a('number');
          res.body.data.stats.should.have.property('losses').to.not.equal(null).to.be.a('number');
          res.body.data.stats.should.have
            .property('incompletes')
            .to.not.equal(null)
            .to.be.a('number');
          res.body.data.stats.should.have
            .property('totalCaptures')
            .to.not.equal(null)
            .to.be.a('number');
          res.body.data.stats.should.have
            .property('totalTime')
            .to.not.equal(null)
            .to.be.a('number');
          res.body.data.stats.should.have
            .property('avgGameLength')
            .to.not.equal(null)
            .to.be.a('number');
          res.body.data.stats.should.have
            .property('avgCaptures')
            .to.not.equal(null)
            .to.be.a('number');
          res.body.should.have.property('error', null);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('Should not get stats for a given email (no games played)', (done) => {
      chai
        .request(APP_URL)
        .get('/stats?email=nogames@email.com')
        .then((res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('data', null);
          res.body.should.have.property('error', ErrorCode.E006);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('Should not get stats when given no email', (done) => {
      chai
        .request(APP_URL)
        .get('/stats')
        .then((res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('data', null);
          res.body.should.have.property('error', ErrorCode.E005);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
