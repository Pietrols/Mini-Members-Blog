const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/authController.js");

// custom validator for password confirmation
const passwordConfirmValidator = body("confirmPassword").custom(
  (value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }
);

// GET /signup route - show signup form
router.get("/signup", authController.getSignup);

// POST /signup route - handle signup
router.post(
  "/signup",
  [
    body("firstName")
      .trim()
      .isLength({ min: 2 })
      .withMessage("First name must be at least 2 characters")
      .escape(),
    body("lastName")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Last name must be at least 2 characters")
      .escape(),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Must be a valid email")
      .normalizeEmail(),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be atleast 8 characters")
      .matches(/\d/)
      .withMessage("Password must contain at least one number")
      .matches(/[a-z]/)
      .withMessage("Password must comtain a lowercase letter")
      .matches(/[A-Z]/)
      .withMessage("Password must contain an uppercase letter"),
    passwordConfirmValidator,
  ],
  authController.postSignup
);

module.exports = router;
