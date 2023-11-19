import { UnauthorizedException } from '@nestjs/common';

export interface UserAnauthorizedPayload {
  timeToWait: number | null;
}

export class UserAnauthorizedException extends UnauthorizedException {
  public payload: UserAnauthorizedPayload;

  constructor(payload: UserAnauthorizedPayload) {
    super('Bad password for user');
    this.payload = payload;
  }
}
