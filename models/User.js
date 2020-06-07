var crypto = require("crypto");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  projects: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "OscarFile" }],
    required: true,
  },
});
userSchema.methods.generatePasswordReset = function () {
  this.passwordResetToken = crypto.randomBytes(20).toString("hex");
  this.passwordResetExpires = Date.now() + 3600000; //expires in an hour
};

const User = mongoose.model("User", userSchema);
module.exports = User;
