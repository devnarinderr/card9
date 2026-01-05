const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const {
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = require("./common/utilities/constants.js");
const dbConn = require("./db/conn");

// Handle case where database models might not be available
const User = dbConn.user || null;

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      console.log(profile);
      return done(null, profile);
      // });
    }
  )
);

passport.use(
  new TwitterStrategy(
    {
      consumerKey:TWITTER_CONSUMER_KEY,
      consumerSecret:TWITTER_CONSUMER_SECRET,
      callbackURL: "/auth/twitter/callback",
    },
    function (token, tokenSecret, profile, done) {
      console.log(profile);

      // User.findOrCreate({ twitterId: profile.id }, function (err, user) {
      // });
      return done(null, profile);
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/oAuth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, cb) => {
      // Check if database is available
      if (!User) {
        return cb(new Error("Database not available"), null);
      }
      
      const defaultUser = {
        first_name: profile.name.givenName,
        last_name: profile.name.familyName,
        email: profile.emails[0].value,
        profile: profile.photos[0].value,
        password: accessToken,
      };
      const user = await User.findOrCreate({
        where: { email: defaultUser.email },
        defaults: defaultUser,
      }).catch((error) => {
        cb(error, null);
      });
      if (user && user[0]) {
        return cb(null, user && user[0]);
      }
    }
  )
);

passport.serializeUser(async (user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  // Check if database is available
  if (!User) {
    return cb(new Error("Database not available"), null);
  }
  
  const user = await User.findOne({ where: { id } }).catch((error) => {
    cb(error, null);
  });

  if (user) cb(null, user);
});