const dbConn = require("../db/conn");
// Handle case where database models might not be available
const Catalogue = dbConn.catalogue || null;
const Card = dbConn.card || null;
const Utils = require("../common/utilities/index.js");
const { Op, Sequelize } = require("sequelize");

exports.newCatalogue = async (req, res) => {
  // Check if database is available
  if (!Catalogue || !Card) {
    return res.status(503).send({
      msg: "Database not available. Catalogue creation temporarily disabled.",
    });
  }
  
  const cardId = req.body.catalogData.card[0].id;
  const isCardTheme = req.body.catalogData.isCardTheme;
  const cardTheme = await Card.findOne({ where: { id: cardId } }).then(
    (response) => {
      return response.theme;
    }
  );

  let name;
  const image = req.body.catalogData.image;
  const finalData = Object.assign(req.body.catalogData, {
    image: Utils.base64ToMedia(name, image, "png"),
    userId: req.params.userId,
    theme: isCardTheme ? cardTheme : "#fff",
  });

  Catalogue.create(finalData)
    .then((response) => {
      res.status(201).json({
        msg: "Catalogue created successfully.",
        response,
      });
    })
    .catch((error) => {
      res.status(400).json({
        msg: "Catalogue is not created.",
        err: error,
      });
    });
};

exports.deleteCatalogue = async (req, res) => {
  // Check if database is available
  if (!Catalogue) {
    return res.status(503).send({
      msg: "Database not available. Catalogue deletion temporarily disabled.",
    });
  }
  
  Catalogue.findOne({ where: { id: req.params.id } })
    .then(async (response) => {
      await Utils.deleteLocalImage(response.image);
      response.destroy().then((resp) => {
        res.status(202).send({
          msg: "Catalogue deleted successfully.",
        });
      });
    })
    .catch((error) => {
      res.status(204).send({
        msg: "Error while deleting Catalogue.",
      });
    });
};

exports.getOneCatalogue = async (req, res) => {
  // Check if database is available
  if (!Catalogue) {
    return res.status(503).send({
      msg: "Database not available. Catalogue service temporarily disabled.",
    });
  }
  
  Catalogue.findOne({ where: { id: req.params.id } })
    .then((response) => {
      const finalCatelogueData = Object.assign(response, {
        image: Utils.base64_encode(response.image, "png"),
      });
      res.status(200).json({
        msg: "Catalogue successfully fetched.",
        catalogue: finalCatelogueData,
      });
    })
    .catch((error) => {
      res.status(400).send({
        msg: "Catalogue not exists.",
        err: error,
      });
    });
};

exports.getOneCatalogueWithName = async (req, res) => {
  // Check if database is available
  if (!Catalogue) {
    return res.status(503).send({
      msg: "Database not available. Catalogue service temporarily disabled.",
    });
  }
  
  Catalogue.findOne({ where: { title: req.params.name } })
    .then((response) => {
      const finalCatelogueData = Object.assign(response, {
        image: Utils.base64_encode(response.image, "png"),
      });
      res.status(200).json({
        msg: "Catalogue successfully fetched.",
        catalogue: finalCatelogueData,
      });
    })
    .catch((error) => {
      res.status(400).send({
        msg: "Catalogue not exists.",
        err: error,
      });
    });
};

exports.getAllCatalogue = async (req, res) => {
  // Check if database is available
  if (!Catalogue) {
    return res.status(503).send({
      msg: "Database not available. Catalogue service temporarily disabled.",
    });
  }
  
  const id = req.params.cardId;

  await Catalogue.findAll({
    where: Sequelize.literal(`JSON_CONTAINS(card, '{"id": ${id}}')`),
    attributes: {
      exclude: ["createdAt", "updatedAt", "url", "price"],
    },
  })
    .then((response) => {
      let img = [];
      response.forEach((catalogue) => {
        const catalogueId = catalogue.id;
        const image = catalogue.image;
        if (image !== null) {
          img.push({ [catalogueId]: Utils.base64_encode(image, "png") });
        }
      });

      res.status(200).json({
        msg: "Catalogue successfully fetched.",
        catalogues: response,
        images: img,
      });
    })
    .catch((error) => {
      res.status(400).send({
        msg: "Catalogue not exists.",
        err: error,
      });
    });
};

exports.getAllCatalogueByUserId = async (req, res) => {
  // Check if database is available
  if (!Catalogue) {
    return res.status(503).send({
      msg: "Database not available. Catalogue service temporarily disabled.",
    });
  }
  
  const id = req.params.userId;
  await Catalogue.findAll({
    where: { userId: id },
  })
    .then((response) => {
      let img = [];
      response.forEach((catalogue, idx) => {
        const catalogueId = catalogue.id;
        const image = catalogue.image;
        if (image !== null) {
          img.push({ [catalogueId]: Utils.base64_encode(image, "png") });
        }
      });

      res.status(200).json({
        msg: "Catalogue successfully fetched.",
        catalogues: response,
        images: img,
      });
    })
    .catch((error) => {
      res.status(400).send({
        msg: "Catalogue not exists.",
        err: error,
      });
    });
};

exports.editCatalogue = async (req, res) => {
  // Check if database is available
  if (!Catalogue || !Card) {
    return res.status(503).send({
      msg: "Database not available. Catalogue editing temporarily disabled.",
    });
  }
  
  const image = req.body.catalogueData.image;
  const isCardTheme = req.body.catalogueData.isCardTheme;
  const cardId = req.body.catalogueData.card[0].id;
  const cardTheme = await Card.findOne({ where: { id: cardId } }).then(
    (response) => {
      return response.theme;
    }
  );

  let name;
  Catalogue.findOne({ where: { id: req.params.id } }).then(async (response) => {
    const finalData = Object.assign(req.body.catalogueData, {
      image: Utils.base64ToMedia(name, image, "png"),
      userId: response.userId,
      theme: isCardTheme ? cardTheme : "#000",
    });

    const catalogueUpdated = response.update(finalData, {
      where: { id: req.params.id },
    });
    catalogueUpdated
      .then((response) => {
        res.status(202).json({
          msg: "Catalogue Successfully Updated.",
          card: response,
        });
      })
      .catch((error) => {
        res.status(400).send({
          msg: "Error happend during update.",
          err: error,
        });
      });
  });
};