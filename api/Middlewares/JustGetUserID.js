var jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
const myRes = require("../Helper/Response");

function getToken(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers["x-access-token"];
  if (!token) return next();
  jwt.verify(token, process.env.JWTSEC, function (err, decoded) {
    if (err) return next();
    req.userId = decoded.id;
    req.userFName = decoded.name.split(" ")[0];
    req.userName = decoded.name;
    console.log(" 3");
    next();
  });
}

module.exports = getToken;
