import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  logger = new Logger();
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    const info = `${req.method} ${res.statusCode}  |   ${req.originalUrl} `;

    return next.handle().pipe(
      tap({
        next: (val: unknown): void => {
          this.logger.log(info);
        },
        error: (err: Error): void => {
          this.logger.error(info);
        },
      }),
    );

    // return next.handle().pipe(tap(() => this.logger.log(info)));
  }
}
