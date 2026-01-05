const controller = require("../controller/admin.controller");

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
    res.setHeader("content-type", "text/vcard");
    res.setHeader("content-type", "application/x-www-form-urlencoded");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });

  app.get("/api/admin/all-users", controller.getAllUsers);
  app.get("/api/admin/card-by-userId/:id", controller.getCardByUserId);
  app.patch("/api/admin/updateUser/:id", controller.updateUser);
  app.patch("/api/admin/renew-card/:id", controller.renewCard);
};
