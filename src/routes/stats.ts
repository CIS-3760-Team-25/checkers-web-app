/* November 15, 2021
 * CIS-3760 Team 25
 * Games Endpoint (/games)
 */

import { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { Logger } from '../../utils/log';
import { ErrorCode } from '../../utils/enums';
import db from '../../utils/db';

const logger = Logger('Checkers API');

export default {
  // Get player stats associated with a given email
  get: async (req: Request, res: Response) => {
    const email = req.query?.email;

    if (!email) {
      res.status(400).json({ data: null, error: ErrorCode.E005 });
      return;
    }

    const selectQuery = `
      SELECT
        id, start_time, end_time, player_one_captures AS captures,
        (CASE WHEN outcome='player_one_win' THEN true ELSE false END) AS won,
        (CASE WHEN outcome='draw' THEN true ELSE false END) AS draw,
        (CASE WHEN outcome='incomplete' THEN true ELSE false END) AS incomplete
      FROM game LEFT JOIN capture ON (game.id = capture.game_id)
      WHERE player_one->>'email'=$1
      UNION
      SELECT
        id, start_time, end_time, player_two_captures AS captures,
        (CASE WHEN outcome='player_two_win' THEN true ELSE false END) AS won,
        (CASE WHEN outcome='draw' THEN true ELSE false END) AS draw,
        (CASE WHEN outcome='incomplete' THEN true ELSE false END) AS incomplete
      FROM game LEFT JOIN capture ON (game.id = capture.game_id)
      WHERE player_two->>'email'=$1;
    `;
    const selectValues = [email];

    db.query(selectQuery, selectValues)
      .then((result: QueryResult) => {
        if (result.rowCount > 0) {
          logger.info(`Retrieved games played with email (${email})`);

          const gamesPlayed = result.rowCount;
          const wins = result.rows.filter((game) => game.won).length;
          const draws = result.rows.filter((game) => game.draw).length;
          const incompletes = result.rows.filter((game) => game.incomplete).length;
          const losses = gamesPlayed - wins - draws - incompletes;
          const totalCaptures = result.rows
            .map((game) => game.captures)
            .reduce((total, gameCaptures) => total + gameCaptures);
          const totalTime = result.rows
            .filter((game) => !game.incomplete)
            .map((game) => +new Date(game.end_time) - +new Date(game.start_time))
            .reduce((total, gameLength) => total + gameLength, 0);

          const avgGameLength = totalTime / gamesPlayed;
          const avgCaptures = totalCaptures / gamesPlayed;

          res.status(200).json({
            data: {
              stats: {
                gamesPlayed,
                wins,
                draws,
                incompletes,
                losses,
                totalCaptures,
                totalTime,
                avgGameLength,
                avgCaptures,
              },
            },
            error: null,
          });
        } else {
          logger.error(`No games associated with email (${email})`);
          res.status(404).json({ data: null, error: ErrorCode.E006 });
        }
      })
      .catch((error: Error) => {
        logger.error(`Failed to get player stats (${email}): ${error}`);
        res.status(500).json({ data: null, error: ErrorCode.E005 });
      });
  },
};
