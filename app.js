require("dotenv").config();
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const passport = require("./config/passport"); // ← Load config first
const authRoutes = require("./routes/authRoutes.js"); // ← Then load routes
const membershipRoutes = require("./routes/membershipRoutes.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Flash messages (must come after session)
app.use(flash());

// Passport initialization (must come after session)
app.use(passport.initialize());
app.use(passport.session());

// Make user available in all views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// View engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Routes
app.use("/", authRoutes);
app.use("/", membershipRoutes);

// Home route
app.get("/", (req, res) => {
  res.render("index");
});

// 404 handler
app.use((req, res) => {
  res.status(404).send("<h1>404 - Page Not Found</h1>");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("<h1>500 - Something went wrong!</h1>");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
