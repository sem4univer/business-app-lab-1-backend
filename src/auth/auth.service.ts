import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { getHashedPassword } from '../users/users.utils';
import { UsersService } from '../users/users.service';
import { JwtUserPayload } from './auth.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.getCredsByEmail(email);
    if (!user || user.password !== getHashedPassword(password)) {
      throw new UnauthorizedException();
    }
    const payload: JwtUserPayload = { id: user.id, email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      role: user.role.title,
    };
  }
}
