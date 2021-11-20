/* November 15, 2021
 * CIS-3760 Team 25
 * Games Endpoint (/games)
 */

import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { Logger } from '../../utils/log';
import ErrorCodes from '../../utils/error-codes';
import db from '../../utils/db';

const logger = Logger('Checkers API');

export default {
  // Record a new game between 2 players
  post: async (req: Request, res: Response) => {
    const gameId = req.body?.gameId;
    const playerOne = req.body?.playerOne;
    const playerTwo = req.body?.playerTwo;

    if (!gameId || !playerOne?.name || !playerTwo?.name) {
      res.status(400).json({ data: null, error: ErrorCodes.E001 });
      return;
    }

    const insertQuery = 'INSERT INTO game (id, player_one, player_two) VALUES ($1, $2, $3);';
    const insertValues = [gameId, JSON.stringify(playerOne), JSON.stringify(playerTwo)];

    db.query(insertQuery, insertValues)
      .then(() => {
        logger.info(`Created game record (${gameId})`);
        res.status(201).json({ data: null, error: null });
      })
      .catch((error: Error) => {
        logger.error(`Failed to create game record (${gameId}): ${error}`);
        res.status(500).json({ data: null, error: ErrorCodes.E001 });
      });
  },
  // Record game results
  put: async (req: Request, res: Response) => {
    const gameId = req.body?.gameId;
    const outcome = req.body?.outcome;

    const captures = {
      playerOne: req.body?.playerOneCaptures,
      playerTwo: req.body?.playerTwoCaptures,
    };

    if (!gameId || !outcome || !captures?.playerOne || !captures?.playerTwo) {
      res.status(400).json({ data: null, error: ErrorCodes.E002 });
      return;
    }

    const updateQuery = 'UPDATE game SET outcome=$1, end_time=NOW() WHERE id=$2;';
    const updateValues = [outcome, gameId];

    db.query(updateQuery, updateValues)
      .then((result: QueryResult) => {
        if (result.rowCount > 0) {
          logger.info(`Updated game record (${gameId})`);

          const insertQuery = 'INSERT INTO capture VALUES ($1, $2, $3);';
          const insertValues = [gameId, captures.playerOne, captures.playerTwo];

          db.query(insertQuery, insertValues)
            .then(() => {
              logger.info(`Stored game captures (${gameId})`);
              res.status(200).json({ data: null, error: null });
            })
            .catch((error: Error) => {
              logger.error(`Failed to store game captures (${gameId}): ${error}`);
              res.status(500).json({ data: null, error: ErrorCodes.E003 });
            });
        } else {
          logger.error(`Could not find game record (${gameId})`);
          res.status(404).json({ data: null, error: ErrorCodes.E004 });
        }
      })
      .catch((error: Error) => {
        logger.error(`Failed to update game record (${gameId}): ${error}`);
        res.status(500).json({ data: null, error: ErrorCodes.E002 });
      });
  },
};
