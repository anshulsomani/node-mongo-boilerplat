const mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

mongoose.model("User", UserSchema);

module.exports = mongoose.model("User");
