const controller = require("../controller/catalogue.controller");

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

  app.post("/api/catalogue/new-catalogue/:userId", controller.newCatalogue);
  app.delete("/api/catalogue/delete/:id", controller.deleteCatalogue);
  app.get("/api/catalogue/:id", controller.getOneCatalogue);
  app.get("/api/catalogue/name/:name", controller.getOneCatalogueWithName);
  app.get("/api/catalogue/all-catalogue/:cardId", controller.getAllCatalogue);
  app.get(
    "/api/catalogue/all-catalogue-by-user/:userId",
    controller.getAllCatalogueByUserId
  );
  app.patch("/api/catalogue/edit/:id", controller.editCatalogue);
};
