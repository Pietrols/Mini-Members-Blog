const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const membershipController = require("../controllers/membershipController");
const { ensureAuthenticated } = require("../middleware/authMiddleware");

// Join club routes (must be authenticated)
router.get("/join-club", ensureAuthenticated, membershipController.getJoinClub);
router.post(
  "/join-club",
  ensureAuthenticated,
  [body("passcode").trim().notEmpty().withMessage("Passcode is required")],
  membershipController.postJoinClub
);

module.exports = router;
