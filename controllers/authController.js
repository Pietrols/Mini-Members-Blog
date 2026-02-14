const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { createUser, findUserByEmail } = require("../db/queries");
const passport = require("passport"); 

// Show signup form
exports.getSignup = (req, res) => {
  res.render("signup", { errors: [], formData: {} });
};

// Handle signup form submission
exports.postSignup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("signup", {
      errors: errors.array(),
      formData: req.body,
    });
  }

  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.render("signup", {
        errors: [{ msg: "Email already registered" }],
        formData: req.body,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // pass isAdmin flag
    const adminStatus = isAdmin === "on";
    const newUser = await createUser(
      firstName,
      lastName,
      email,
      hashedPassword,
      adminStatus
    );

    res.redirect("/login");
  } catch (err) {
    next(err);
  }
};

// Show login form
exports.getLogin = (req, res) => {
  res.render("login", {
    error: req.flash("error"),
    formData: {},
  });
};

// Handle login (Passport does the heavy lifting)
exports.postLogin = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
});

// Handle logout
exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
