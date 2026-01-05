const dbConn = require("../db/conn");
// Handle case where database models might not be available
const User = dbConn.user || null;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Check if database is available
  if (!User) {
    return res.status(503).send({
      message: "Database not available. Registration temporarily disabled."
    });
  }
  
  // Username
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Email is already in use!"
      });
      return;
    }

    next();
  });
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;