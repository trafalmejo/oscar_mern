const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
var crypto = require("crypto");
var path = require("path");
var nodemailer = require("nodemailer");
require("dotenv/config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

//Project Model
const User = require("../../models/User");
const Token = require("../../models/Token");

// @route POST request api/auth
// @desc Authentincate user
// @access Public LOGIN
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
        if (!user.isVerified) {
          console.log("is not verified");
          //res.render("/resend-confirmation");
          // res.redirect("/resend-confirmation");
          return res.status(307).json({ msg: "Please verify your account" });
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
// @route GET request api/auth/confirmation
// @desc Confirm token
router.get("/confirmation/:token", (req, res) => {
  // Find a matching token
  Token.findOne({ token: req.params.token }, function (err, token) {
    if (!token) {
      // return res.status(400).send({
      //   type: "not-verified",
      //   msg:
      //     "We were unable to find a valid token. Your token my have expired.",
      // });
      var string = encodeURIComponent(
        "We were unable to find a valid token. Your token my have expired."
      );
      return res.redirect(process.env.CLIENT_ORIGIN + "/?msg=" + string);
    }

    // If we found a token, find a matching user
    User.findOne({ _id: token._userId }, function (err, user) {
      if (!user) {
        var string = encodeURIComponent(
          "We were unable to find a user for this token."
        );
        return res.redirect(process.env.CLIENT_ORIGIN + "/?msg=" + string);
      }
      // return res
      //   .status(400)
      //   .send({ msg: "We were unable to find a user for this token." });
      if (user.isVerified) {
        // return res.status(400).send({
        //   type: "already-verified",
        //   msg: "This user has already been verified.",
        // });
        var string = encodeURIComponent("This user has already been verified.");
        return res.redirect(process.env.CLIENT_ORIGIN + "/?msg=" + string);
      }
      // Verify and save the user
      user.isVerified = true;
      user.save(function (err) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }
        // return res
        //   .status(200)
        //   .json({ msg: "The account has been verified. Please log in." });
        var string = encodeURIComponent(
          "Your account has been verified. Please log in."
        );
        return res.redirect(process.env.CLIENT_ORIGIN + "/?msg=" + string);
      });
    });
  });
});
// @route GET request api/auth/resend
// @desc resend token to user's email
router.post("/resend", (req, res) => {
  ////
  const { email } = req.body;

  //Simple validation
  if (!email) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  User.findOne({ email: email }, function (err, user) {
    if (!user)
      return res
        .status(400)
        .json({ msg: "We were unable to find a user with that email." });
    if (user.isVerified)
      return res.status(400).json({
        msg: "This account has already been verified. Please log in.",
      });

    // Create a verification token, save it, and send email
    var token = new Token({
      _userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });

    // Save the token
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
          return res.status(500).json({ msg: err.message });
        }
        res
          .status(200)
          .json("A verification email has been sent to " + user.email + ".");
      });
    });
  });
});
// @route GET request api/auth/resetpassword/:token
// @desc Confirm token
router.get("/resetpassword/:token", (req, res) => {
  console.log("server resetpassword");
  //console.log(req);
  User.findOne({
    passwordResetToken: req.params.token,
    passwordResetExpires: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user)
        return res
          .status(401)
          .json({ message: "Password reset token is invalid or has expired." });

      //Redirect user to form with the email address
      //res.render("reset-password");
      // res.sendFile(
      //   path.resolve(__dirname, "../", "../client", "public", "index.html")
      // );
      res.redirect(
        process.env.CLIENT_ORIGIN + "/reset-password/" + req.params.token
      );
      //res.sendFile(path.join(__dirname, "public", "index.html"));
      // res.render("reset", { user });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
});
// @route POST api/auth/recoverpassword
// @desc Recover Password - Generates token and Sends password reset password
// @access Public
router.post("/recoverpassword", (req, res) => {
  console.log("send email reset");
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user)
        return res.status(401).json({
          msg:
            "The email address " +
            req.body.email +
            " is not associated with any account. Double-check your email address and try again.",
        });

      //Generate and set password reset token
      user.generatePasswordReset();

      // Save the updated user object
      user
        .save()
        .then((user) => {
          // send email
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
          //console.log(req);
          var mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: user.email,
            subject: "Reset Password",
            text:
              "Hello,\n\n" +
              "Please reset your password at the following link: \nhttp://" +
              req.headers.host +
              "/api/auth/resetpassword/" +
              user.passwordResetToken +
              ".\n",
          };
          transporter.sendMail(mailOptions, function (err) {
            if (err) {
              return res.status(500).json({ msg: err.message });
            }
            console.log("reset answer");
            res.status(200).json({
              msg:
                "Reset password instructions has been sent to " +
                user.email +
                ".",
            });
          });
        })
        .catch((err) => res.status(500).json({ msg: err.message }));
    })
    .catch((err) => res.status(500).json({ msg: err.message }));
});
// @route POST api/auth/resetpassword
// @desc Reset Password
// @access Public
router.post("/resetpassword", (req, res) => {
  console.log("server changing password");
  // console.log(req);
  User.findOne({
    passwordResetToken: req.body.token,
    passwordResetExpires: { $gt: Date.now() },
  }).then((user) => {
    if (!user)
      return res
        .status(401)
        .json({ msg: "Password reset token is invalid or has expired." });

    console.log("user found");
    let newhash;
    //Create salt and hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) {
          return res.status(401).json({ msg: err });
        }
        console.log("hash generated");
        console.log(hash);
        newhash = hash;
        //Set the new password
        user.password = newhash;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        console.log("new password");
        console.log(user.password);
        // Save
        user.save((err) => {
          if (err) return res.status(500).json({ msg: err.message });
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
            subject: "Your password has been changed",
            text:
              `Hello, ${user.name}\n\n` +
              `This is a confirmation that the password for your account ${user.email} has just been changed.\n`,
          };
          transporter.sendMail(mailOptions, function (err) {
            if (err) {
              return res.status(500).json({ msg: err.message });
            }
            res
              .status(200)
              .json("Your password has been updated: " + user.email + ".");
          });
        });
      });
      if (err) {
        return res.status(401).json({ msg: err });
      }
    });
  });
});

module.exports = router;
