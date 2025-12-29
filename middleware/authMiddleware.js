// ensure user is authenticated
exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

// ensure user is a member
exports.ensureMember = (req, res, next) => {
  if (req.isAuthenticated() && req.user.is_member) {
    return next();
  }
  res.status(403).send("<h1>403 - Members Only</h1>");
};

// ensure user is an admin
exports.ensureAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.is_admin) {
    return next();
  }
  res.status(403).send("<h1>403 - Admins Only</h1>");
};
