const dotenv = require('dotenv');
dotenv.config();

module.exports ={
  "development": {
    "username": process.env.DB_USERNAME,
    "password":process.env.DB_USERNAME,
    "database": process.env.DB_USERNAME,
    "host": process.env.DB_USERNAME,
    "dialect": "postgres",
  },
  "test": {
    "username": process.env.DB_USERNAME,
    "password":process.env.DB_USERNAME,
    "database": process.env.DB_USERNAME,
    "host": process.env.DB_USERNAME,
    "dialect": "postgres",
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password":process.env.DB_USERNAME,
    "database": process.env.DB_USERNAME,
    "host": process.env.DB_USERNAME,
    "dialect": "postgres",
  }
}
