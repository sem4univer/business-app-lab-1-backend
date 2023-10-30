import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { DataSource } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/role/roles.guard';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [ConfigModule.forRoot({}), DatabaseModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
