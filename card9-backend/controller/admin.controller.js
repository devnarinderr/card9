const dbConn = require("../db/conn");
const { API_URL } = require("../common/utilities/constants.js");

// Handle case where database models might not be available
const Card = dbConn.card || null;
const User = dbConn.user || null;

const IMAGE_URL = `${API_URL}/images/`//from env

exports.getAllUsers = async (req, res) => {
  // Check if database is available
  if (!User) {
    return res.status(503).send({
      msg: "Database not available. Admin service temporarily disabled.",
    });
  }
  
  try {
    const users = await User.findAll(); // Fetch all users

    const payload = [];
    for (const user of users) {
      const card = await Card.findOne({ where: { userId: user.id } });
      const userPayload = {
        user,
        card: card ? card.toJSON() : null,
      };
      payload.push(userPayload);
    }
    res.status(200).json({
      msg: "Users and associated cards successfully fetched.",
      payload: payload,
    });
  } catch (error) {
    // Handle error
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to fetch users and associated cards." });
  }
};

exports.updateUser = async (req, res) => {
  // Check if database is available
  if (!User) {
    return res.status(503).send({
      msg: "Database not available. Admin service temporarily disabled.",
    });
  }
  
  const user = await User.findOne({ where: { id: req.params.id } });

  if (!user) {
    return res.status(401).send({
      msg: "Unable to update User.",
    });
  } else {
    User.update(req.body.values, {
      where: { id: req.params.id },
    }).then((resp) => {
      res.status(200).json({
        msg: "User Updated",
      });
    });
  }
};

exports.renewCard = async (req, res) => {
  // Check if database is available
  if (!Card) {
    return res.status(503).send({
      msg: "Database not available. Card renewal temporarily disabled.",
    });
  }
  
  try {
    const { id } = req.params;

    if (id) {
      const card = await Card.findByPk(id);

      if (!card) {
        console.log(`Card with ID ${id} not found.`);
        return res.status(404).json({
          msg: "Card not found",
        });
      }

      const currentDate = new Date();
      const lastExpiryPlusOneYear = new Date(card.expiredAt);
      lastExpiryPlusOneYear.setFullYear(
        lastExpiryPlusOneYear.getFullYear() + 1
      );

      if (card.expiredAt < lastExpiryPlusOneYear) {
        const newExpiryDate = new Date(card.expiredAt);
        newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);

        const [numUpdatedRows, updatedRows] = await Card.update(
          { expiredAt: newExpiryDate },
          { where: { id: id } }
        );

        if (numUpdatedRows > 0) {
          console.log(
            `Card with ID ${id} renewed. New expiry date: ${newExpiryDate}`
          );
          return res.status(200).json({
            msg: "Card is Renewed",
            newExpiryDate: newExpiryDate,
          });
        } else {
          console.log(`Failed to update card with ID ${id}.`);
          return res.status(500).json({
            msg: "Failed to update card",
          });
        }
      } else {
        console.log(
          `Expiry date is already greater than last-expiry-date + 1 year.`
        );
        return res.status(200).json({
          msg: "No action needed. Expiry date is already greater than last-expiry-date + 1 year.",
        });
      }
    } else {
      console.log("Invalid ID provided");
      return res.status(400).json({
        msg: "Invalid ID provided",
      });
    }
  } catch (error) {
    console.error("Error renewing card:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

exports.getCardByUserId = async (req, res) => {
  // Check if database is available
  if (!User || !Card) {
    return res.status(503).send({
      msg: "Database not available. Card service temporarily disabled.",
    });
  }
  
  try {
    const { id } = req.params;

    if (id) {
      const userResponse = await User.findOne({ where: { id: id } });
      const cardResponse = await Card.findAll({ where: { userId: id } });

      let userPayload = {
        ...userResponse.dataValues,
        profile:
          userResponse.profile != null
            ? `${IMAGE_URL}${userResponse.profile}.png`
            : null,
      };

      let cardPayload = [];
      if (cardResponse) {
        for (let cards in cardResponse) {
          let temp = {
            ...cardResponse[cards].dataValues,
            profile: `${IMAGE_URL}${cardResponse[cards].profile}.png`,
            logo: `${IMAGE_URL}${cardResponse[cards].logo}.png`,
          };
          cardPayload.push(temp);
        }
      }

      res.status(200).json({
        msg: "Card successfully fetched.",
        card: cardPayload,
        user: userPayload,
      });
    }
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};