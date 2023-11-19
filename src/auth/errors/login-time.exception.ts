import { HttpException, HttpStatus } from '@nestjs/common';

export interface LoginTimePayload {
  timeToWait: number;
}

export class LoginTimeException extends HttpException {
  public payload: LoginTimePayload;
  public errorType = 'USER_BLOCKED';

  constructor(payload: LoginTimePayload) {
    super(
      'User can be log in the system, because time for wait is not expired',
      HttpStatus.BAD_REQUEST,
    );
    this.payload = payload;
  }
}
