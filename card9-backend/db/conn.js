const Sequelize = require("sequelize");

// Load environment variables directly from process.env
const DB_NAME = process.env.DB_NAME || "";
const DB_HOST = process.env.DB_HOST || "";
const DB_USER = process.env.DB_USER || "";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_DIALECT = process.env.DB_DIALECT || "";

let dbConn = {};

// Check if required environment variables are provided
if (DB_NAME && DB_HOST && DB_USER && DB_DIALECT) {
  const dbConnection = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: 3306, // Explicitly specify the default MySQL port
    dialect: DB_DIALECT,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false, // Disable logging for production
    dialectOptions: {
      multipleStatements: true
    }
  });

  dbConnection
    .authenticate()
    .then(() => {
      console.log("Database connection established successfully.");
    })
    .catch((error) => {
      console.error("Failed to connect to database:", error.message);
    });

  dbConn.Sequelize = Sequelize;
  dbConn.dbConnection = dbConnection;

  // Only load models if database connection is available
  try {
    dbConn.user = require("../models/user.js")(dbConnection, Sequelize);
    dbConn.card = require("../models/card.js")(dbConnection, Sequelize);
    dbConn.catalogue = require("../models/catalogue.js")(dbConnection, Sequelize);
    
    if (dbConn.user && dbConn.card) {
      dbConn.user.hasMany(dbConn.card);
    }
  } catch (error) {
    console.error("Failed to load models:", error.message);
  }
} else {
  console.warn("Database environment variables not set. Running without database connection.");
  dbConn.Sequelize = Sequelize;
  dbConn.dbConnection = null;
}

module.exports = dbConn;