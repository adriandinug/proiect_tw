import * as dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(null, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: 3306,
  dialect: 'mysql',
  logging: console.log,
  ssl: true,
  dialectOptions: {
    database: 'notesapp',
  },
});
