import { Office } from './entities/office.entity';
import { SharedModule } from './../shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { UserRelationService } from './user-relation.service';
import { Role } from './entities/role.entity';

@Module({
  imports: [
    SharedModule,
    AuthModule,
    TypeOrmModule.forFeature([User, Office, Role]),
  ],
  providers: [UserRelationService],
  controllers: [UsersController],
})
export class UsersModule {}
