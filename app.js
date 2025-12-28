require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const passport = require("./config/passport.js");
const authRoutes = require("./routes/authRoutes.js");
const flash = require("connect-flash");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false })); // Parse form data
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Session configuration (needed for Passport later)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// flash messages - after session
app.use(flash());

// passport initialization - after session
app.use(passport.initialize());
app.use(passport.session());

// make user available in all views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// View engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Routes
app.use("/", authRoutes);

// Home route (placeholder for now)
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Members Only</h1><a href='/signup'>Sign Up</a>");
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
