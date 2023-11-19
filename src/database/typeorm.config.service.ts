import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { PostgresConnectionCredentialsOptions } from 'typeorm/driver/postgres/PostgresConnectionCredentialsOptions';
import * as fs from 'node:fs';

import { Country } from '../users/entities/country.entity';
import { Office } from '../users/entities/office.entity';
import { Role } from '../users/entities/role.entity';
import { User } from '../users/entities/user.entity';
import { AuthEvent } from '../auth/auth-event/entities/auth-event.entity';

import { Schedule } from './../schedule/entities/schedule.entity';
import { Route } from './../schedule/entities/route.entity';
import { Aircraft } from './../schedule/entities/aircraft.entity';
import { Airport } from '../schedule/entities/airport.entity';

import { BaseSeeding1698593212716 } from './migrations/1698593212716-BaseSeeding';
import { UserSeed1698613518645 } from './migrations/1698613518645-UserSeed';
import { ScheduleSeed1700379864857 } from './migrations/1700379864857-schedule-seed';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): DataSourceOptions {
    let additionalConfig: Partial<
      Pick<PostgresConnectionCredentialsOptions, 'ssl'>
    > = {};
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    if (isProduction) {
      additionalConfig = {
        ssl: {
          rejectUnauthorized: true,
          ca: fs.readFileSync('/usr/.postgresql/root.crt').toString(),
        },
      };
    }

    return {
      type: 'postgres',
      host: this.configService.get('DATABASE_HOST'),
      port: this.configService.get('DATABASE_PORT'),
      username: this.configService.get('DATABASE_USERNAME'),
      password: this.configService.get('DATABASE_PASSWORD'),
      database: this.configService.get('DATABASE_NAME'),
      synchronize: true,
      entities: [
        Country,
        Office,
        Role,
        User,
        AuthEvent,
        Aircraft,
        Airport,
        Route,
        Schedule,
      ],
      migrations: [
        BaseSeeding1698593212716,
        UserSeed1698613518645,
        ScheduleSeed1700379864857,
      ],
      migrationsTableName: 'migrations',
      migrationsRun: true,
      namingStrategy: new SnakeNamingStrategy(),
      ...additionalConfig,
    };
  }
}
