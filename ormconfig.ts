import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
config();

import dataSourceOption from './database.config';

export const dataSource = new DataSource(dataSourceOption as DataSourceOptions);
