const verifySignUp = require("../middleware/verifySignUp");
const controller = require("../controller/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });

  app.post(
    "/api/auth/register",
    [verifySignUp.checkDuplicateUsernameOrEmail],
    controller.register
  );

  app.patch("/api/auth/emailVerification/:user", controller.emailVerification);

  app.post("/api/auth/login", controller.login);

  app.get("/api/auth/logout", controller.logout);

  app.post("/api/auth/update-email/:userId", controller.updateEmail);

  app.post("/api/auth/update-profil/:userId", controller.updateProfile);

  app.delete("/api/auth/delete-user/:userId", controller.deleteUser);

  app.patch("/api/auth/resetPassword/:token", controller.resetPassword);
};
