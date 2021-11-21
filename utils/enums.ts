export enum ErrorCode {
  E001 = 'Failed to create game record',
  E002 = 'Failed to update game record',
  E003 = 'Failed to store game captures',
  E004 = 'Game record not found',
  E005 = 'Failed to get player statistics',
  E006 = 'No games found',
}

export enum GameOutcome {
  INCOMPLETE = 'incomplete',
  PLAYER_ONE_WIN = 'player_one_win',
  PLAYER_TWO_WIN = 'player_two_win',
  DRAW = 'draw',
}
