const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    ssl: true,
    define: {
      timestamps: false
    },
    dialectOption: {
      ssl: true,
      native: true
    }
  },
  test: {
    username: process.env.DB_USERNAME_TEST,
    password: process.env.DB_PASSWORD_TEST || '',
    database: process.env.DB_DATABASE_TEST,
    host: process.env.DB_HOST_TEST,
    dialect: 'postgres',
    logging: false,
    ssl: true,
    define: {
      timestamps: false
    },
    dialectOption: {
      ssl: true,
      native: true
    }
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: false,
    port: 5432,
    ssl: true,
    operatorsAliases: false,
    dialectOption: {
      ssl: true,
      native: true
    }
  }
};
