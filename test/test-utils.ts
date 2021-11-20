import { Logger } from 'winston';
import db from '../utils/db';

function deleteGameRecord(uuid: string, logger: Logger) {
  db.query('DELETE FROM game WHERE id=$1', [uuid])
    .catch(() => logger.info('Successfuly deleted game record'))
    .catch((err) => logger.error(`Failed to delete game record: ${err}`));
}

function deleteCaptureRecord(uuid: string, logger: Logger) {
  db.query('DELETE FROM capture WHERE game_id=$1', [uuid])
    .catch(() => logger.info('Successfuly deleted capture record'))
    .catch((err) => logger.error(`Failed to delete capture record: ${err}`));
}

export default {
  deleteGameRecord,
  deleteCaptureRecord,
};
