const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { findUserByEmail, findUserById } = require("../db/queries");

// configure local strategy
passport.use(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    try {
      const user = await findUserByEmail(email);

      // user doesnt exist
      if (!user) {
        return done(null, false, { message: "Incorrect email or password" });
      }

      // compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect email or password" });
      }

      // success - return user without password
      const { password: _, ...userWithoutPassword } = user;
      return done(null, userWithoutPassword);
    } catch (err) {
      return done(err);
    }
  }
);

// serialize user (store user id in session)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize user (retrieve user from DB using id from session)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
