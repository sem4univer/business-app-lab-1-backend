import { LoginTimeException } from './login-time.exception';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserAnauthorizedException } from './user-unauthorized.exception';

@Catch(HttpException)
export class LoginExceptionFilter implements ExceptionFilter {
  catch(
    exception: LoginTimeException | UserAnauthorizedException,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorMessage = exception.message;
    const payload = exception.payload;

    response.status(status).json({
      statusCode: status,
      errorMessage,
      timestamp: new Date().toISOString(),
      path: request.url,
      payload,
    });
  }
}
