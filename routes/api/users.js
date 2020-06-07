const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
var crypto = require("crypto");
var nodemailer = require("nodemailer");
require("dotenv/config");
const jwt = require("jsonwebtoken");
//Project Model
const User = require("../../models/User");
const Token = require("../../models/Token");

// @route POST request api/users
// @desc Register new user SIGN UP
// @access Public
router.post("/", (req, res) => {
  const { name, lastname, email, password } = req.body;

  //Simple validation
  if (!name || !lastname || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  //Check for existing user
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }
      const newUser = new User({
        name,
        lastname,
        email,
        password,
      });
      //Create salt and hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save().then((user) => {
            // Create a verification token for this user
            var token = new Token({
              _userId: user._id,
              token: crypto.randomBytes(16).toString("hex"),
            });

            // Save the verification token
            token.save(function (err) {
              if (err) {
                return res.status(500).send({ msg: err.message });
              }

              // Send the email
              var transporter = nodemailer.createTransport({
                host: "mail.privateemail.com",
                port: 465,
                secure: true,
                auth: {
                  user: process.env.EMAIL_USERNAME,
                  pass: process.env.EMAIL_PASSWORD,
                },
              });
              var mailOptions = {
                from: process.env.EMAIL_USERNAME,
                to: user.email,
                subject: "Account Verification Token",
                text:
                  "Hello,\n\n" +
                  "Please verify your account by click in the link: \nhttp://" +
                  req.headers.host +
                  "/api/auth/confirmation/" +
                  token.token +
                  ".\n",
              };
              transporter.sendMail(mailOptions, function (err) {
                if (err) {
                  return res.status(500).send({ msg: err.message });
                }
                return res.status(400).json({
                  msg: "A confirmation email was sent to your account",
                });

                // res
                //   .status(200)
                //   .send(
                //     "A verification email has been sent to " + user.email + "."
                //   );
                // jwt.sign(
                //   { id: user.id },
                //   process.env.jwtSecret,
                //   { expiresIn: 3600 },
                //   (err, token) => {
                //     if (err) throw err;
                //     ////

                //     ////
                //     // res.json({
                //     //   token,
                //     //   user: {
                //     //     id: user.id,
                //     //     name: user.name,
                //     //     email: user.email,
                //     //   },
                //     // });
                //   }
                // );
              });
            });
          });
        });
      });
    })
    .catch((error) => {
      console.log("error db");
      return res
        .status(400)
        .json({ msg: "There is an error with the platform. Try later." });
    });
});

module.exports = router;
