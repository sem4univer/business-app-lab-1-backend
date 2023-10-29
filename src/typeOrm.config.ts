import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { TypeOrmConfigService } from './database/typeorm.config.service';

config();

const configService = new ConfigService();

export default new DataSource(
  new TypeOrmConfigService(configService).createTypeOrmOptions(),
);
