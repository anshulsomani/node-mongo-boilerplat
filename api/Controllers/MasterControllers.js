var express = require("express");
var router = express.Router();
var aqp = require("api-query-params");
const model = require("../Models/GenericModel");
var RouteMiddleware = require("../Middlewares/RouteMiddleware");
const myRes = require("../Helper/Response");

var createDocs = function (documents, collection, res) {
  try {
    var Model = model(collection);
  } catch (e) {
    console.log(e);
  }
  Model.insertMany([...documents["data"]], function (err, result) {
    console.log(err);
    if (err) return myRes.error(res, err, 500, result);
    return myRes.sccuess(res, true, { result: result });
  });
};

var findDocs = function (collection, req, res) {
  try {
    var Model = model(collection);
  } catch (e) {
    console.log(e);
  }
  const query = aqp(req.query);
  // console.log(query);
  const { filter, skip, limit, sort, projection, population } = query;
  console.log(filter, skip, limit, sort, projection, population);
  Model.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(projection)
    .populate(population)
    .exec(function (err, result) {
      if (err) return myRes.error(res, err, 500, result);
      return myRes.sccuess(res, true, { result: result });
    });
};

var updateDoc = function (collection, id, changes, res) {
  try {
    var Model = model(collection);
  } catch (e) {
    console.log(e);
  }
  Model.updateOne({ _id: id }, req.body, { new: true }, function (err, result) {
    if (err) return myRes.error(res, err, 500, result);
    if (result.nModified > 0)
      return myRes.sccuess(res, true, { result: result });
    else return myRes.sccuess(res, false, { result: result });
  });
};

var patchDoc = function (collection, req, res) {
  try {
    var Model = model(collection);
  } catch (e) {
    console.log(e);
  }
  var mFilter = { _id: req.params.id };
  switch (collection) {
    case "address":
    case "todos":
      mFilter["idAuthor"] = req.userId;
      break;

    default:
      console.log("");
      break;
  }
  Model.updateOne(mFilter, { $set: req.body }, function (err, result) {
    if (err) return mResponse.error(res, err, 500, result);
    if (result.nModified > 0) return mResponse.sccuess(res, true);
    else return mResponse.sccuess(res, false);
  });
};
var deleteDoc = function (collection, id, res) {
  try {
    var Model = model(collection);
  } catch (e) {
    console.log(e);
  }
  Model.deleteOne({ _id: id }, function (err, result) {
    if (err) return myRes.error(res, err, 500, result);
    if (result.deletedCount > 0)
      return myRes.sccuess(res, true, { result: result });
    else return myRes.sccuess(res, false, { result: result });
  });
};

router
  .get("/:collection", RouteMiddleware, function (req, res) {
    // var collection = req.params.collection;
    // var id = req.params.id;
    // req.query = { _id: id };
    // findDocs(collection, req, res);
    return myRes.error(res, "404", 404);
  })
  .get("/:collection/:id", RouteMiddleware, function (req, res) {
    // var collection = req.params.collection;
    // var id = req.params.id;
    // req.query = { _id: id };
    // findDocs(collection, req, res);
    return myRes.error(res, "404", 404);
  })
  .post("/:collection", function (req, res) {
    var collection = req.params.collection;
    createDocs(req.body, collection, res);
  })
  .put("/:collection/:id", RouteMiddleware, function (req, res) {
    //var collection = req.params.collection;
    //var id = req.params.id;
    return myRes.error(res, "404", 404);
    // updateDoc(collection, id, req.body, res);
  })
  .patch("/:collection/:id", RouteMiddleware, function (req, res) {
    //var collection = req.params.collection;
    //var id = req.params.id;
    return myRes.error(res, "404", 404);
    //patchDoc(collection, req, res);
  })
  .delete("/:collection/:id", RouteMiddleware, function (req, res) {
    // var collection = req.params.collection;
    // var id = req.params.id;
    return myRes.error(res, "404", 404);
    // deleteDoc(collection, id, res);
  });

module.exports = router;
