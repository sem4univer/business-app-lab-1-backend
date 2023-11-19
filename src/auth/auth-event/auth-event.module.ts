import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEvent } from './entities/auth-event.entity';
import { AuthEventService } from './auth-event.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuthEvent])],
  providers: [AuthEventService],
  exports: [AuthEventService],
})
export class AuthEventModule {}
