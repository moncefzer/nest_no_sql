import { HttpException, HttpStatus } from '@nestjs/common';

export class EmptyMessageException extends HttpException {
  constructor() {
    super('Message cannot be empty', HttpStatus.BAD_REQUEST);
  }
}
