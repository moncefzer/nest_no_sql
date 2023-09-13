import { HttpException, HttpStatus } from '@nestjs/common';

export class CannotEditMessageException extends HttpException {
  constructor() {
    super('Cannot edit message', HttpStatus.FORBIDDEN);
  }
}
