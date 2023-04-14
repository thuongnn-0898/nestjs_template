import * as dotenv from 'dotenv';

import { UserSubscriber } from './src/entity-subscribers/user-subscriber';

dotenv.config();

export default {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  entities: ['src/modules/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  migrationDir: ['src/database/migrations'],
  subscribers: [UserSubscriber],
};
