require("dotenv").config();
const { updateUserMemberStatus } = require("../db/queries");

// secret passcode
const MEMBER_PASSCODE = process.env.MEMBER_PASSCODE;

// show join club form
exports.getJoinClub = (req, res) => {
  // Redirect if already a member
  if (req.user && req.user.is_member) {
    return res.redirect("/");
  }

  res.render("join-club", { error: null });
};

// handle join club form submission
exports.postJoinClub = async (req, res, next) => {
  const { passcode } = req.body;

  // check password
  if (passcode !== MEMBER_PASSCODE) {
    return res.render("join-club", {
      error: "Incorrect passcode. Please try again.",
    });
  }

  try {
    // update user to member
    const updateUser = await updateUserMemberStatus(req.user.id, true);

    // update session with new user data
    req.user.is_member = true;
    res.redirect("/");
  } catch (err) {
    next(err);
  }
};
