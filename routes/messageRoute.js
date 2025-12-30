const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const messageController = require("../controllers/messageController");
const {
  ensureAuthenticated,
  ensureAdmin,
} = require("../middleware/authMiddleware");

// New message routes (authenticated users only)
router.get(
  "/new-message",
  ensureAuthenticated,
  messageController.getNewMessage
);

router.post(
  "/new-message",
  ensureAuthenticated,
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 3, max: 255 })
      .withMessage("Title must be 3-255 characters")
      .escape(),

    body("text")
      .trim()
      .notEmpty()
      .withMessage("Message text is required")
      .isLength({ min: 10 })
      .withMessage("Message must be at least 10 characters")
      .escape(),
  ],
  messageController.postNewMessage
);

// Delete message route (admin only)
router.post(
  "/message/:id/delete",
  ensureAdmin,
  messageController.deleteMessage
);

module.exports = router;
