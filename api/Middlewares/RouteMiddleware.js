var AuthMiddleware = require("./AuthMiddleware");
var JustGetUserID = require("./JustGetUserID");
const myRes = require("../Helper/Response");

function RouteMiddleware(req, res, next) {
  var url = req.params.collection;
  var id = req.params.id;
  var method = req.method;
  var str = method + url;
  if (id != null && id != undefined && method == "GET") str = str + "ID";
  console.log(str);
  switch (str) {
    ////////////////////////////////protected routes///////////////////////////////////////////////////////
    case "GETtodos":
      return AuthMiddleware(req, res, () => {
        req.query["_id"] = req.userId;
        next();
      });
    case "DELETEtodos":
      return AuthMiddleware(req, res, () => {
        req.query["_id"] = id;
        req.query["idAuthor"] = req.userId; //add user to query to show only logged in user todos
        next();
      });

    case "POSTtodos":
      return AuthMiddleware(req, res, () => {
        req.body["idAuthor"] = req.userId; // add user to body to add uid to created todo
        req.body["dateUpdated"] = new Date().getTime();
        req.body["dateCreated"] = new Date().getTime();
        next();
      });

    case "PUTtodos":
    case "PATCHtodos":
      return AuthMiddleware(req, res, () => {
        delete req.body.dateCreated;
        req.query["_id"] = id;
        req.query["idAuthor"] = req.userId;
        req.body["idAuthor"] = req.userId; // add user to body to add uid to created todo
        req.body["dateUpdated"] = new Date().getTime();
        next();
      });

    case "products":
    case "productss":
      return mResponse.error(res, "err", 500, result);
    /////////////////////////////////////////////////////////////ID/////////////////////////////////////////////
    case "GETtodoID":
      return AuthMiddleware(req, res, () => {
        req.query["_id"] = id;
        next();
      });

    ////////////////////////////////down all open///////////////////////////////////////////////////////////////
    default:
      //next(); //all other routes are open
      console.log("RouteMiddleware default Message : " + str);
      //return AuthMiddleware(req, res, next); //all other routes are protected
      return myRes.error(res, "404 " + str, 404);
  }
}

module.exports = RouteMiddleware;
