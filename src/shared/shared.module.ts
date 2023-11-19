import { BaseUserService } from './base-user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [BaseUserService],
  exports: [BaseUserService],
})
export class SharedModule {}
