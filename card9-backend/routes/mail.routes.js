const controller = require("../controller/mail.controller");

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
    res.setHeader("content-type", "multipart/form-data");
    res.setHeader("content-type", "application/x-www-form-urlencoded");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });

  app.post("/api/mail/sendCard", controller.sendCard);

  app.post("/api/mail/support", controller.supportMail);
  app.post("/api/mail/feedback", controller.feedbackMail);
  app.post("/api/mail/resetPassword/:id", controller.resetPassword);
  app.post("/api/mail/forgotPassword", controller.forgotPassword);
  app.post("/api/mail/contactLead", controller.contactLead);
};