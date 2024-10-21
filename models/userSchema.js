const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  useremail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  userpassword: {
    type: String,
    required: true
  },
  threshold_temperature: {
    type: Number,
    default: 1000
  }
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
