import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { Public } from './auth.decorators';
import { AuthService } from './auth.service';
import { signInResponseSchema, SignInUserDto } from './dto/sign-in-user.dto';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOkResponse({ schema: signInResponseSchema })
  public async signIn(@Body() signInDto: SignInUserDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Get('profile')
  @ApiOkResponse({ type: User })
  @ApiBearerAuth()
  public async getProfile(@Request() req) {
    return req.user;
  }

  @Get('logout')
  @ApiBearerAuth()
  public async logout(@Request() req) {
    await this.authService.logout(req.user);
  }
}
