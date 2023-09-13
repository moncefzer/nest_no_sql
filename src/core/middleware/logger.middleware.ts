import { Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export class LoggerMiddlware implements NestMiddleware {
  logger = new Logger();
  use(req: Request, res: Response, next: NextFunction) {
    next();

    const info = `${req.method} ${res.statusCode}  |   ${req.originalUrl} `;
    this.logger.log(info);
  }
}
