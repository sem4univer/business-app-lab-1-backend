import { HttpException, HttpStatus } from '@nestjs/common';

export class UserBlockedException extends HttpException {
  constructor() {
    super('User is blocked in the system', HttpStatus.BAD_REQUEST);
  }
}
