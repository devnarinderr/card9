const controller = require("../controller/card.controller");

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

  app.get("/api/card/:id", controller.getOneCard);
  app.get("/api/card/all-cards/:userId", controller.getAllCards);
  app.post("/api/card/new-card/:userId", controller.newCard);
  app.delete("/api/card/delete/:id", controller.deleteCard);
  app.get("/api/card/add-contact/:name", controller.downloadVcf);
  app.patch("/api/card/edit/:id", controller.editCard);
};
