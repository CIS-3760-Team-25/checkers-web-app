import { transports, format, createLogger } from 'winston';
import expressWinston from 'express-winston';

function expressFormat() {
  return format.printf(
    (info: any) =>
      `Checkers API - ${info.level} - [${info.timestamp}] : '${info.message}' ${info.meta.res?.statusCode}`,
  );
}

function generalFormat(name: string) {
  return format.printf(
    (info: any) => `${name} - ${info.level} - [${info.timestamp}] : '${info.message}'`,
  );
}

export function ExpressLogger() {
  return expressWinston.logger({
    level: process.env.LOG_LEVEL || 'info',
    transports: [new transports.Console()],
    colorize: true,
    format: format.combine(format.colorize(), format.timestamp(), format.splat(), expressFormat()),
  });
}

export function Logger(name = 'Logger') {
  return createLogger({
    level: process.env.LOG_LEVEL || 'info',
    levels: { error: 0, warn: 1, info: 2 },
    transports: [new transports.Console()],
    format: format.combine(
      format.colorize(),
      format.timestamp(),
      format.splat(),
      generalFormat(name),
    ),
  });
}
