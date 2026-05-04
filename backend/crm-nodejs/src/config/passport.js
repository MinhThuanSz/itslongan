const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { User } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Google Strategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      const avatar = profile.photos?.[0]?.value;

      // Check email trùng với user local → link account
      let user = await User.findOne({ where: { email } });

      if (user) {
        // Link social vào tài khoản đã có
        if (user.provider === 'local') {
          await user.update({ provider: 'google', provider_id: profile.id, avatar: avatar || user.avatar });
        }
      } else {
        // Tạo mới
        user = await User.create({
          name: profile.displayName || 'Google User',
          email,
          password: null,
          provider: 'google',
          provider_id: profile.id,
          avatar,
          role: 'CUSTOMER',
        });
      }

      const token = generateToken(user);
      return done(null, { user, token });
    } catch (err) {
      return done(err, null);
    }
  }
));

// Facebook Strategy
passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'emails', 'photos'],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      const avatar = profile.photos?.[0]?.value;

      let user = null;
      if (email) {
        user = await User.findOne({ where: { email } });
      }

      if (user) {
        if (user.provider === 'local') {
          await user.update({ provider: 'facebook', provider_id: profile.id, avatar: avatar || user.avatar });
        }
      } else {
        user = await User.create({
          name: profile.displayName || 'Facebook User',
          email: email || `fb_${profile.id}@noemail.com`,
          password: null,
          provider: 'facebook',
          provider_id: profile.id,
          avatar,
          role: 'CUSTOMER',
        });
      }

      const token = generateToken(user);
      return done(null, { user, token });
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((data, done) => done(null, data));
passport.deserializeUser((data, done) => done(null, data));

module.exports = passport;
