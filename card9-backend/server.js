const express = require("express");
const path = require("path");
require('dotenv').config();

const app = express();
app.disable('etag');

// Middleware for parsing requests
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// Enable CORS
app.use(require("cors")({ origin: "*" }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Database connection
const dbConn = require("./db/conn");
// Only sync if database connection exists
if (dbConn.dbConnection) {
  dbConn.dbConnection.sync().catch(error => {
    console.error("Database sync failed:", error.message);
  });
}

// API Routes - Register BEFORE static files
require("./routes/admin.routes.js")(app);
require("./routes/auth.routes.js")(app);
require("./routes/card.routes.js")(app);
require("./routes/catalogue.routes.js")(app);
require("./routes/mail.routes.js")(app);
require("./routes/oAuth.routes.js")(app);

// Serve images from uploads directory
app.use("/images", express.static(path.join(__dirname, "uploads")));

// Explicitly handle root route to ensure proper HTML response
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"), {
    headers: {
      'Content-Type': 'text/html'
    }
  });
});

// Serve static files from React build directory
app.use(express.static(path.join(__dirname, "client/build")));

app.get("/test", (req, res) => res.send("Server alive!"));

// Catch-all handler to send React app for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"), {
    headers: {
      'Content-Type': 'text/html'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    message: err.message,
  });
});

// Use PORT from environment or default to 8080
const PORT = process.env.PORT || 8080;

// Export the app for Passenger to start the server automatically
// Do not call app.listen() as Hostinger uses Passenger to manage the server
module.exports = app;