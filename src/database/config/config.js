const config = require('dotenv');

config.config();

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
    username: process.env.DB_TEST_USERNAME,
    password: process.env.DB_TEST_PASSWORD || '',
    database: process.env.DB_TEST_DATABASE,
    host: process.env.DB_TEST_HOST || '127.0.0.1',
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
