const sessions = require("express-session");
const passport = require("passport");
const { isUserAuthenticated } = require("../middleware/auth");
const { API_URL } = require("../common/utilities/constants");
var cors = require("cors");
const jwt = require("jsonwebtoken");

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

  app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );

  app.use(
    sessions({
      secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
      saveUninitialized: true,
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
      resave: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.get(
    "/api/oAuth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
  );

  app.get(
    "/api/oAuth/google/callback",
    passport.authenticate("google", {
      successRedirect: `${API_URL}/app/cards`,
      failureRedirect: `${API_URL}/login`,
      failureMessage: true,
    })
  );

  app.get("/api/oAuth/user", isUserAuthenticated, (req, res) => {
    const token = jwt.sign({ id: req.user.id }, "the-super-strong-secrect", {
      expiresIn: "12h",
    });
    res.status(200).send({
      token: token,
      msg: "User feched or created Successfully",
      user: {
        id: req.user.id,
        firstName: req.user.first_name,
        lastName: req.user.last_name,
        email: req.user.email,
      },
    });
  });

  app.get(
    "/api/oAuth/facebook",
    passport.authenticate("facebook", { scope: ["email", "profile"] })
  );

  app.get(
    "/api/oAuth/facebook/callback",
    passport.authenticate("facebook", {
      successRedirect: "/",
      failureRedirect: "/login",
    })
  );

  app.get("/api/oAuth/logout", function (req, res, next) {
    req.logout();
    res.redirect("/");
  });
};
