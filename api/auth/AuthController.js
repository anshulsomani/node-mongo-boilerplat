var express = require("express");
var router = express.Router();
const myRes = require("../Helper/Response");
const model = require("../Models/GenericModel");

var VerifyToken = require("./VerifyToken");

var User = require("../Models/User");

/**
 * Configure JWT
 */
var jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
var bcrypt = require("bcryptjs");

router.post("/login", function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return myRes.error(res, "Error on the server.", 500);
    if (!user) return myRes.error(res, "No user found.", 404);
    // check if the password is valid
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid)
      return myRes.error(res, "No user found.", 401, {
        auth: false,
        token: null,
      });

    var mData = { ...user._doc };
    delete mData.password;
    //user["password"] = null;
    return genrateToken(res, mData);
  });
});

router.post("/register", function (req, res) {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  try {
    var Model = model("users");
  } catch (e) {
    console.log(e);
  }
  req.body.password = hashedPassword;
  var milliseconds = new Date().getTime();
  req.body.dateJoin = milliseconds;
  req.body.lastOnline = milliseconds;
  req.body.status = 0;
  req.body.type = "user";

  Model.create(req.body, function (err, result) {
    if (err)
      return myRes.error(
        res,
        "There was a problem registering the user ",
        500,
        result
      );
    var mData = { ...result._doc };
    delete mData.password;
    //result["password"] = null;
    return genrateToken(res, mData);
  });
});

router.get("/me", VerifyToken, function (req, res) {
  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err)
      return myRes.error(res, "There was a problem finding the user.", 500);
    if (!user) return myRes.error(res, "No user found.", 404);

    return genrateToken(res, user._doc);
  });
});

router.patch("/profile", VerifyToken, function (req, res) {
  // if (req.userId == "DEMOaccoutnid") {
  //   console.log("/profle udpate demo");
  //   return myRes.error(res, "\nRegister / Login To update profile", 500, {
  //     result: [],
  //   });
  // }

  try {
    var Model = model("users");
  } catch (e) {
    console.log(e);
  }
  if (req.body.password != null || req.body.password != undefined) {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    req.body.password = hashedPassword;
  }
  var milliseconds = new Date().getTime();
  req.body.lastOnline = milliseconds;

  Model.updateOne(
    { _id: req.userId },
    { $set: req.body },
    function (err, result) {
      if (err)
        return myRes.error(
          res,
          "There was a problem udpating the user ",
          500,
          result
        );
      var mData = { ...result._doc };
      delete mData.password;
      //result["password"] = null;
      return genrateToken(res, mData);
    }
  );
});

router.get("/logout", function (req, res) {
  return myRes.sccuess(res, true, { auth: false, token: null });
});

var genrateToken = function (res, user) {
  var token = jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWTSEC,
    {
      expiresIn: 86400 * 30, // expires in 24 hours
    }
  );
  let userss = { ...user, token: token };
  return myRes.sccuess(res, true, {
    auth: true,
    token: token,
    result: [userss],
  });
};

module.exports = router;
