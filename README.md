require("dotenv").config();
const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const appRouter = require("./routes/indexRoutes");
const bcrypt = require("bcryptjs");

app.set("views", path.join(\_\_dirname, "views"));
app.set("view engine", "ejs");

const app = express();
app.use(express.static(path.join(\_\_dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());

passport.use(
new LocalStrategy(async (username, password, done) => {
try {
const { rows } = await pool.query(
"SELECT \* FROM users WHERE username = $1",
[username]
);
const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }

})
);

passport.serializeUser((user, done) => {
done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
try {
const { rows } = await pool.query("SELECT \* FROM users WHERE id = $1", [
id,
]);
const user = rows[0];

    done(null, user);

} catch (err) {
done(err);
}
});

app.use((req, res, next) => {
res.locals.currentUser = req.user;
next();
});

app.listen(port, (error) => {
if (error) {
throw error;
}
console.log("app listening on port " + port + ".");
});
