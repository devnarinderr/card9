const dbConn = require("../db/conn");
const path = require("path");
const Utils = require("../common/utilities/index.js");
const vCardsJS = require("vcards-js");
const { Sequelize } = require("sequelize");
const cache = require("../node-cache/nodeCache.js");
const {
  facebookBaseUrl,
  linkedinBaseUrl,
  API_URL,
} = require("../common/utilities/constants.js");
const zlib = require("zlib");
const fs = require("fs");

// Handle case where database models might not be available
const Card = dbConn.card || null;
const User = dbConn.user || null;
const Catalogue = dbConn.catalogue || null;

   

const filterCardData = (cardData, infoData) => {
  let objectData = [];

  let { info, profile, logo, ...newObject } = cardData;

  infoData.map((data) => {
    let { icon, text, ...newInfo } = data;
    objectData.push(newInfo);
  });

  let infoObj = [];

  objectData.filter((value) => {
    if (typeof value === "object" && value !== null) {
      infoObj[value.name.toLowerCase()] = value.value;
    }
  });

  return Object.assign(newObject, infoObj);
};

exports.getOneCard = async (req, res) => {
  // Check if database is available
  if (!Card) {
    return res.status(503).send({
      msg: "Database not available. Card service temporarily disabled.",
    });
  }
  
  const cardId = req.params.id;

  try {
    //node-cache
    const cachedData = cache.get(`card:${cardId}`);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const card = await Card.findOne({
      where: { cardName: cardId },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!card) return res.status(400).json({ msg: "Card not exists" });

    const isVideo = card.isVideoProfile;
    const contentType = isVideo ? "mp4" : "png";
    const imageBaseUrl = API_URL ? `${API_URL}/images` : "https://card9.me/images";

    const responseData = {
      msg: "Card successfully fetched",
      card,
      images: {
        profile: `${imageBaseUrl}/${card.profile}.${contentType}`,
        logo: `${imageBaseUrl}/${card.logo}.png`,
      },
    };

    //store data inside node-cache
    cache.set(`card:${cardId}`, responseData);

    
    res.status(200).json(responseData);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err: err.message });
  }
};

exports.getAllCards = (req, res) => {
  // Check if database is available
  if (!Card) {
    return res.status(503).send({
      msg: "Database not available. Card service temporarily disabled.",
    });
  }
  
  Card.findAll({ where: { userId: req.params.userId } })
    .then((response) => {
      let images = [];
      response.forEach((card, idx) => {
        const cardId = card.id;
        const profile = card.profile;
        const isVideo = card.isVideoProfile;
        if (profile !== null && !isVideo) {
          const imageData = Utils.base64_encode(profile, "png");
          if (imageData !== null) {
            images.push({ [cardId]: imageData });
          }
        } else if (profile !== null && isVideo) {
          const videoData = Utils.base64_encode(profile, "mp4");
          if (videoData !== null) {
            images.push({ [cardId]: videoData });
          }
        }
      });
      res.status(200).json({
        msg: "User having cards",
        cards: response,
        images: images,
      });
    })
    .catch((error) => {
      res.status(404).send({
        msg: "User dosen't have any cards available or get into error.",
        err: error,
      });
    });
};

exports.newCard = async (req, res) => {
  // Check if database is available
  if (!Card || !User) {
    return res.status(503).send({
      msg: "Database not available. Card creation temporarily disabled.",
    });
  }
  
  let name;
  let isVideo = req.body.cardData.isVideoProfile;
  const profile = req.body.cardData.profile;
  const logo = req.body.cardData.logo;
  const cardData = req.body.cardData;
  const infoData = req.body.cardData.info;
  const filteredData = filterCardData(cardData, infoData);
  const MIMEType = Utils.extractExtensionFromBase64(profile);

  const finalData = Object.assign(filteredData, {
    userId: req.params.userId,
    isVideoProfile: isVideo,
    profile: Utils.base64ToMedia(name, profile, MIMEType),
    logo: Utils.base64ToMedia(name, logo, "png"),
    expiredAt: Utils.addOneYear(new Date()),
  });

  const cardNameAvailable = await Card.findOne({
    where: { cardName: finalData.cardName },
  });
  if (cardNameAvailable === null) {
    Card.create(finalData)
      .then((response) => {
        User.update(
          { totalCards: Sequelize.literal("totalCards + 1") },
          { where: { id: req.params.userId } }
        );
        res.status(201).json({
          msg: "Card created successfully.",
          response,
        });
      })
      .catch((error) => {
        res.status(400).json({
          msg: "Card is not created.",
          err: error,
        });
      });
  } else {
    res.status(400).json({
      msg: "Card name not available.",
    });
  }
};

exports.editCard = async (req, res) => {
  // Check if database is available
  if (!Card) {
    return res.status(503).send({
      msg: "Database not available. Card editing temporarily disabled.",
    });
  }
  
  const profile = req.body.cardData.profile;
  const logo = req.body.cardData.logo;
  const isVideo = req.body.cardData.isVideoProfile;
  const cardData = req.body.cardData;
  const infoData = req.body.cardData.info;
  const updatedData = filterCardData(cardData, infoData);
  const MIMEType = Utils.extractExtensionFromBase64(profile);

  try {
    const card = await Card.findOne({ where: { id: req.params.id } });
    if (!card) {
      return res.status(404).json({ msg: "Card not found" });
    }

    const finalData = Object.assign(updatedData, {
      isVideoProfile: isVideo,
      profile: Utils.base64ToMedia(card.profile, profile, MIMEType),
      logo: Utils.base64ToMedia(card.logo, logo, "png"),
    });

    const updatedCard = await card.update(finalData);

    // Invalidate node cache
    cache.del(`card:${updatedCard.cardName}`);

    res.status(202).json({
      msg: "Card Successfully Updated.",
      card: updatedCard,
    });

    if (Catalogue) {
      await Catalogue.update(
        { theme: updatedCard.theme },
        {
          where: Sequelize.literal(
            `JSON_CONTAINS(card, '{"id": ${updatedCard.id}}')`
          ),
        }
      );
    }
  } catch (error) {
    res.status(500).json({
      msg: "Error occurred during update.",
      err: error.message,
    });
  }
};

exports.downloadVcf = async (req, res) => {
  // Check if database is available
  if (!Card) {
    return res.status(503).send({
      msg: "Database not available. VCF download temporarily disabled.",
    });
  }
  
  const uploadsBaseUrl = `${API_URL}/static/uploads`;

  await Card.findOne({ where: { cardName: req.params.name } })
    .then((response) => {
      const vcard = vCardsJS();
      const imageName = response.profile;
      const logoName = response.logo;

      const imageUrl = `${uploadsBaseUrl}/${imageName}.png`;
      const logoUrl = `${uploadsBaseUrl}/${logoName}.png`;

      vcard.firstName = response.firstName;
      vcard.middleName = response.middleName;
      vcard.lastName = response.lastName;
      vcard.uid = response.userId;
      vcard.organization = response.company;
      vcard.photo.attachFromUrl(imageUrl, "PNG");

      vcard.workPhone = response.phone;
      vcard.title = response.title;
      vcard.workUrl = response.website;
      vcard.note = response.headline;
      vcard.logo.attachFromUrl(logoUrl, "PNG");

      vcard.namePrefix = response.prefix;
      vcard.cellPhone = response.whatsapp;
      vcard.email = response.email;
      vcard.homeAddress.street = response.address;
      vcard.workAddress.street = response.addressUrl;

      vcard.socialUrls["facebook"] = `${facebookBaseUrl}/${response.facebook}`;
      vcard.socialUrls["linkedIn"] = `${linkedinBaseUrl}/${response.linkedin}`;

      const fileName = vcard.firstName + ".vcf";
      vcard.saveToFile(fileName);
      res.setHeader("Content-Type", "text/vcard");
      res.attachment(fileName);

      const cardData = vcard.getFormattedString();

      res.send(cardData);
    })
    .catch((error) => {
      res.status(400).send({
        msg: "Card not exists.",
        err: error,
      });
    });
};

exports.deleteCard = (req, res) => {
  // Check if database is available
  if (!Card || !User) {
    return res.status(503).send({
      msg: "Database not available. Card deletion temporarily disabled.",
    });
  }
  
  Card.findOne({ where: { cardName: req.params.id } })
    .then(async (response) => {
      await Utils.deleteLocalImage(response.profile);
      await Utils.deleteLocalImage(response.logo);
      User.update(
        { totalCards: Sequelize.literal("totalCards - 1") },
        { where: { id: response.userId } }
      );
      response.destroy().then((resp) => {
        res.status(202).send({
          msg: "Card deleted successfully.",
        });
      });
    })
    .catch((error) => {
      res.status(204).send({
        msg: "Error while deleting card.",
      });
    });
};