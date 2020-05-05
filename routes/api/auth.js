const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
require("dotenv/config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

//Project Model
const User = require("../../models/User");

// @route POST request api/auth
// @desc Authentincate user
// @access Public
router.post("/", (req, res) => {
  const { email, password } = req.body;

  //Simple validation
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  //Check for existing user
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    //Validate password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      } else {
        jwt.sign(
          { id: user.id },
          process.env.jwtSecret,
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;
            //console.log("login success");
            res.json({
              token,
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
              },
            });
          }
        );
      }
    });
  });
});

// @route GET request api/auth/user
// @desc GET user data
// @access Private
router.post("/user", auth, (req, res) => {
  console.log("request user data");
  //console.log(req);
  console.log(req.user.id);
  User.findById(req.user.id)
    .select("-password")
    .then((user) => res.json(user));
});
module.exports = router;
