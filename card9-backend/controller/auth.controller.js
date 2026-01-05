const dbConn = require("../db/conn");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Utils = require("../common/utilities/index.js");

// Handle case where database models might not be available
const User = dbConn.user || null;
const Card = dbConn.card || null;

exports.register = (req, res) => {
  // Check if database is available
  if (!User) {
    return res.status(503).send({
      msg: "Database not available. Registration temporarily disabled.",
    });
  }
  
  User.create({
    role: req.body.role || "user",
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      res.status(201).json({
        msg: "User registered successfully.",
        user,
      });
    })
    .catch((error) => {
      res.status(400).send({
        msg: "Error while registering user.",
        err: error,
      });
    });
};

exports.emailVerification = (req, res) => {
  // Check if database is available
  if (!User) {
    return res.status(503).send({
      msg: "Database not available. Email verification temporarily disabled.",
    });
  }
  console.log("-=0-=-=-=--=-=-=-=-=", req.body);
};

exports.login = async (req, res) => {
  // Check if database is available
  if (!User) {
    return res.status(503).send({
      msg: "Database not available. Login temporarily disabled.",
    });
  }
  
  const user = await User.findOne({ where: { email: req.body.email } });

  if (!user) {
    return res.status(404).send({
      error: "Email or password is incorrect!",
    });
  }

  let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

  if (!passwordIsValid) {
    return res.status(401).send({
      accessToken: null,
      error: "Invalid Password!",
    });
  } else {
    const token = jwt.sign({ id: user.id }, "the-super-strong-secrect", {
      expiresIn: "12h",
    });

    let profileImage = null;
    try {
      if (user.profile) {
        profileImage = Utils.base64_encode(user.profile, "png");
      }
    } catch (error) {
      // If there's an error reading the profile image, just leave it as null
      console.warn("Could not load profile image:", error.message);
      profileImage = null;
    }

    res.status(200).json({
      token,
      data: {
        id: user.id,
        role: user.role,
        profile: profileImage,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        limit: user.limit,
      },
    });
  }
};

exports.updateEmail = async (req, res) => {
  // Check if database is available
  if (!User) {
    return res.status(503).send({
      msg: "Database not available. Email update temporarily disabled.",
    });
  }
  
  const user = await User.findOne({ where: { id: req.params.userId } });

  if (!user) {
    return res.status(401).send({
      msg: "Unable to update email.",
    });
  } else {
    User.update(
      {
        email: req.body.email,
      },
      {
        where: { id: req.params.userId },
      }
    )
      .then((effectedRow) => {
        if (effectedRow == 1) {
          User.findOne({ where: { id: req.params.userId } }).then(
            (updatedData) => {
              const profileImage = Utils.base64_encode(
                updatedData.profile,
                "png"
              );
              res.status(200).json({
                msg: "Email updated successfully.",
                data: {
                  id: updatedData.id,
                  role: updatedData.role,
                  profile: profileImage,
                  firstName: updatedData.first_name,
                  lastName: updatedData.last_name,
                  email: updatedData.email,
                },
              });
            }
          );
        }
      })
      .catch((error) => {
        res.status(400).json({
          msg: "Unable to update email",
          err: error,
        });
      });
  }
};

exports.updateProfile = async (req, res) => {
  // Check if database is available
  if (!User) {
    return res.status(503).send({
      msg: "Database not available. Profile update temporarily disabled.",
    });
  }
  
  let name;
  const user = await User.findOne({ where: { id: req.params.userId } });

  if (!user) {
    return res.status(401).send({
      msg: "Unable to update profile.",
    });
  } else {
    const profile = Utils.base64ToMedia(
      user.profile,
      req.body.data.profile,
      "png"
    );

    User.update(
      {
        profile: profile,
        first_name: req.body.data.first_name,
        last_name: req.body.data.last_name,
      },
      {
        where: { id: req.params.userId },
      }
    )
      .then((effectedRow) => {
        if (effectedRow == 1) {
          User.findOne({ where: { id: req.params.userId } }).then(
            (updatedData) => {
              const profileImage = Utils.base64_encode(
                updatedData.profile,
                "png"
              );
              let profile;
              if (profileImage.length < 200) {
                profile = null;
              } else {
                profile = profileImage;
              }
              res.status(200).json({
                msg: "Profile updated successfully.",
                data: {
                  id: updatedData.id,
                  role: updatedData.role,
                  profile: profile,
                  firstName: updatedData.first_name,
                  lastName: updatedData.last_name,
                  email: updatedData.email,
                },
              });
            }
          );
        }
      })
      .catch((error) => {
        res.status(400).json({
          msg: "Unable to update profile",
          err: error,
        });
      });
  }
};

exports.resetPassword = async (req, res) => {
  // Check if database is available
  if (!User) {
    return res.status(503).send({
      msg: "Database not available. Password reset temporarily disabled.",
    });
  }
  
  const token = req.params.token;
  const password = req.body.data.password;

  if (token && password) {
    await User.findOne({ where: { resetToken: token } }).then((user) => {
      user
        .update(
          {
            password: bcrypt.hashSync(password, 8),
            resetToken: "",
          },
          {
            where: { resetToken: token },
          }
        )
        .then((response) => {
          console.log("-=-=-=-=-=-=", response);
          res.status(201).send({ msg: "Password Reset Success!!" });
        })
        .catch((error) => {
          res.send(error);
        });
    });
  }
};

exports.logout = (req, res, next) => {
  req.session.user = null;
  req.session.save((err) => {
    if (err) next(err);
    req.session.regenerate((err) => {
      if (err) next(err);
      res.redirect("/");
    });
  });
};

exports.deleteUser = async (req, res) => {
  // Check if database is available
  if (!User || !Card) {
    return res.status(503).send({
      msg: "Database not available. Account deletion temporarily disabled.",
    });
  }
  
  const user = await User.findOne({ where: { id: req.params.userId } });

  if (!user) {
    return res.status(404).send({
      msg: "User not found.",
    });
  } else {
    Card.destroy({ where: { userId: req.params.userId } });
    User.destroy({ where: { id: req.params.userId } })
      .then(() => {
        res.status(202).send({
          msg: "Account deleted successfully.",
        });
      })
      .catch((error) => {
        res.status(204).send({
          msg: "Account deletion failed.",
        });
      });
  }
};