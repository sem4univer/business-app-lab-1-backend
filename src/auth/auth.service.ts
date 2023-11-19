import { BaseUserService } from './../shared/base-user.service';
import { UserAnauthorizedException } from './errors/user-unauthorized.exception';
import { LoginTimeException } from './errors/login-time.exception';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { getHashedPassword } from '../users/users.utils';
import { JwtUserPayload } from './auth.interfaces';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import {
  AuthEvent,
  AuthEventType,
} from './auth-event/entities/auth-event.entity';
import { UserBlockedException } from './errors/blocked.exception';
import { User } from 'src/users/entities/user.entity';
import { AuthEventService } from './auth-event/auth-event.service';

export const FAIL_ATTEMPTS_BEFORE_WAIT = 2;
export const INITIAL_WAIT_TIME_MS = 1000 * 10;

@Injectable()
export class AuthService {
  constructor(
    private authEventService: AuthEventService,
    private usersService: BaseUserService,
    private jwtService: JwtService,
  ) {}

  public async signIn(email: string, password: string) {
    const user = await this.usersService.getCredsByEmail(email);
    await this.checkLoginTimeForHandle(user);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.password !== getHashedPassword(password)) {
      const timeToWait = await this.updateAndGetTimeToWait(user);
      throw new UserAnauthorizedException({ timeToWait });
    }

    if (user.isBlocked) {
      throw new UserBlockedException();
    }

    await this.authEventService.create({
      eventType: AuthEventType.LOGIN,
      userId: user.id,
    });

    const payload: JwtUserPayload = { id: user.id, email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user,
    };
  }

  public async signUp(createUserDto: CreateUserDto) {
    const existUser = await this.usersService.findByEmail(createUserDto.email);
    if (existUser) {
      throw new BadRequestException('User already exists');
    }

    const newUser = await this.usersService.create(createUserDto);
    await this.authEventService.create({
      eventType: AuthEventType.LOGIN,
      userId: newUser.id,
    });
    return newUser;
  }

  public async logout(user: User) {
    await this.authEventService.create({
      eventType: AuthEventType.LOGOUT,
      userId: user.id,
    });
  }

  public async getAuthEvents(userId: number): Promise<AuthEvent[]> {
    return await this.authEventService.findAll(userId);
  }

  private async checkLoginTimeForHandle(
    user: Pick<
      User,
      | 'id'
      | 'timeToWaitBeforeLoginMs'
      | 'lastFailedLoginTime'
      | 'lastFailedLoginCount'
    >,
  ): Promise<void> {
    const timeToLoginAccept =
      user.lastFailedLoginTime?.getTime() + user?.timeToWaitBeforeLoginMs;

    if (!user?.timeToWaitBeforeLoginMs || timeToLoginAccept < Date.now()) {
      await this.usersService.update(user.id, {
        timeToWaitBeforeLoginMs: null,
        lastFailedLoginCount: null,
      });
      return;
    }

    const updatedTimeToWaitBeforeLoginMs = user.timeToWaitBeforeLoginMs * 2;

    await this.usersService.update(user.id, {
      lastFailedLoginTime: new Date(),
      lastFailedLoginCount: (user.lastFailedLoginCount ?? 0) + 1,
      timeToWaitBeforeLoginMs: updatedTimeToWaitBeforeLoginMs,
    });

    throw new LoginTimeException({
      timeToWait: updatedTimeToWaitBeforeLoginMs,
    });
  }

  private async updateAndGetTimeToWait(
    user: Pick<
      User,
      | 'id'
      | 'timeToWaitBeforeLoginMs'
      | 'lastFailedLoginTime'
      | 'lastFailedLoginCount'
    >,
  ): Promise<number> {
    const failedLoginAttemptsCount = (user.lastFailedLoginCount ?? 0) + 1;
    const timeToWaitBeforeLoginMs =
      failedLoginAttemptsCount > FAIL_ATTEMPTS_BEFORE_WAIT
        ? INITIAL_WAIT_TIME_MS
        : null;

    await this.usersService.update(user.id, {
      lastFailedLoginTime: new Date(),
      lastFailedLoginCount: failedLoginAttemptsCount,
      timeToWaitBeforeLoginMs,
    });

    return timeToWaitBeforeLoginMs;
  }
}
