const { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_DIALECT } = require('../common/utilities/constants');

module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: DB_DIALECT
  },
};
