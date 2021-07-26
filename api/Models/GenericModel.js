const mongoose = require("mongoose");

var genericSchema = new mongoose.Schema({}, { strict: false });

const model = function (str) {
  return mongoose.model(str, genericSchema, str);
};

module.exports = model;
