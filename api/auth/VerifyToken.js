var jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
const myRes = require("../Helper/Response");

function verifyToken(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers["x-access-token"];
  if (!token)
    return myRes.error(res, "No token provided.", 403, { auth: false });
  // verifies secret and checks exp
  jwt.verify(token, process.env.JWTSEC, function (err, decoded) {
    if (err)
      return myRes.error(res, "Failed to authenticate token.", 500, {
        auth: false,
      });
    req.userId = decoded.id;
    req.userFName = decoded.name.split(" ")[0];
    req.userName = decoded.name;
    next();
  });
}

module.exports = verifyToken;
