const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { createUser, findUserByEmail } = require("../db/queries.js");
const passport = require("../config/passport.js");

// Show signup form
exports.getSignup = (req, res) => {
  res.render("signup", { errors: [], formData: {} });
};

// Handle signup form submission
exports.postSignup = async (req, res, next) => {
  const errors = validationResult(req);

  // If validation fails, re-render form with errors
  if (!errors.isEmpty()) {
    return res.render("signup", {
      errors: errors.array(),
      formData: req.body, // Keep user's input
    });
  }

  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.render("signup", {
        errors: [{ msg: "Email already registered" }],
        formData: req.body,
      });
    }

    // Hash password (10 salt rounds is secure and performant)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const newUser = await createUser(
      firstName,
      lastName,
      email,
      hashedPassword
    );

    // Redirect to login page after successful signup
    res.redirect("/login");
  } catch (err) {
    next(err); // Pass to error handler middleware
  }
};
