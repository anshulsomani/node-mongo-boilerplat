const express = require("express");
var router = express.Router();
var cors = require("cors");
const dotenv = require("dotenv").config();
const app = express();
const myRes = require("./api/Helper/Response");
var port = process.env.PORT || 8080;

var server = app.listen(port, function () {
  console.log("Express server listening on port " + port);
});
var mongooesDB = require("./db");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

var AuthController = require("./api/auth/AuthController");
var MasterController = require("./api/Controllers/MasterController");
var MasterControllers = require("./api/Controllers/MasterControllers");
const { error } = require("./api/Helper/Response");

// app.get("/test", (req, res) => {
//   delete req.body.data;
//   return myRes.sccuess(res, false, { result: req.body });
// });
app.use("/api/auth", AuthController);
app.use("/api", MasterController);
app.use("/apis", MasterControllers);
app.use("/", (req, res) => myRes.error(res, "404", 404));

module.exports = app;
