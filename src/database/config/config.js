import dotenv from 'dotenv';

dotenv.config();

export default {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'postgres'
  },
  test: {
    username: process.env.DB_TEST_USERNAME,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST_PASSWORD,
    host: process.env.DB_TEST_HOST,
    dialect: 'postgres'
  },
  production: {
    username: process.env.DB_PROD_USERNAME,
    password: process.env.DB_PROD_USERNAME,
    database: process.env.DB_PROD_USERNAME,
    host: process.env.DB_PROD_USERNAME,
    dialect: 'postgres'
  }
};
