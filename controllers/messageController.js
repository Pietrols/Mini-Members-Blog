const { validationResult } = require("express-validator");
const {
  createMessage,
  getAllMessages,
  deleteMessage,
} = require("../db/queries.js");

// show new message form
exports.getNewMessage = (req, res) => {
  res.render("new-message", { errors: [], formData: {} });
};

// handle new message submission
exports.postNewMessage = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("new-message", {
      errors: errors.array(),
      formData: req.body,
    });
  }

  const { title, text } = req.body;

  try {
    await createMessage(title, text, req.user.id);
    res.redirect("/");
  } catch (err) {
    next(err);
  }
};

// delte message - admin only
exports.deleteMessage = async (req, res, next) => {
  const { id } = req.params;

  try {
    await deleteMessage(id);
    res.redirect("/");
  } catch (err) {
    next(err);
  }
};
