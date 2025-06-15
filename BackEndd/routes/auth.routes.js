const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");

// **NO** per-route csrfProtection here
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

// Protected “am I still logged in?” endpoint
router.get("/check-auth", isAuthenticated, (req, res) => {
  res.json({ isAuthenticated: true, user: req.session.user });
});

module.exports = router;
