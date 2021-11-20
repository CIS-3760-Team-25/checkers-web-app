/* November 15, 2021
 * CIS-3760 Team 25
 * Games Endpoint (/games)
 */

import { Request, Response } from 'express';
import { Logger } from '../utils/log';
import db from '../utils/db';

const logger = Logger('Checkers API (/games)');

export default {
  post: async (req: Request, res: Response) => {
    const gameId = req.body?.gameId;
    const playerOne = req.body?.playerOne;
    const playerTwo = req.body?.playerTwo;

    if (!gameId || !playerOne?.name || !playerTwo?.name) {
      res.status(400).json({ data: null, error: 'Failed to create new game' });
      return;
    }

    db.query('INSERT INTO game (id, player_one, player_two) VALUES ($1, $2, $3)', [
      gameId,
      JSON.stringify(playerOne),
      JSON.stringify(playerTwo),
    ])
      .then(() => {
        logger.info(`Started new game ${gameId}`);
        res.status(201).json({ data: null, error: null });
      })
      .catch((error: Error) => {
        logger.info(`Failed to start new game ${gameId}: ${error}`);
        res.status(500).json({ data: null, error: 'Failed to create new game' });
      });
  },
};
