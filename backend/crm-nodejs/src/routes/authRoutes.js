const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const {
  register,
  login,
  getMe,
  logout,
} = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
require("dotenv").config();

// Email/Password
router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);
router.post("/logout", authenticate, logout);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
  }),
  (req, res) => {
    const { token, user } = req.user;
    res.redirect(
      `${process.env.CLIENT_URL}/oauth-callback?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email || "")}&avatar=${encodeURIComponent(user.avatar || "")}&role=${user.role}`,
    );
  },
);

// Facebook OAuth
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] }),
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=facebook_failed`,
  }),
  (req, res) => {
    const { token, user } = req.user;
    res.redirect(
      `${process.env.CLIENT_URL}/oauth-callback?token=${token}&name=${encodeURIComponent(user.name)}&avatar=${encodeURIComponent(user.avatar || "")}&role=${user.role}`,
    );
  },
);

module.exports = router;
