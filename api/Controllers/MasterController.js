var express = require("express");
var router = express.Router();
var aqp = require("api-query-params");
const model = require("../Models/GenericModel");
const mResponse = require("../Helper/Response");
var RouteMiddleware = require("../Middlewares/RouteMiddleware");

var createDoc = function (collection, document, res) {
  try {
    var Model = model(collection);
  } catch (e) {
    console.log(e);
  }
  Model.create(document, function (err, result) {
    if (err) return mResponse.error(res, err, 500, result);
    return mResponse.sccuess(res, true, { result: [result] });
  });
};

var findDocs = function (collection, req, res) {
  console.log("findDocs");
  try {
    var Model = model(collection);
  } catch (e) {
    console.log(e);
  }
  console.log(req.query);
  const query = aqp(req.query);
  const { filter, skip, limit, sort, projection, population } = query;
  //console.log(filter, sort, limit, skip, projection, population);

  Model.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(projection)
    .populate(population)
    .exec(function (err, result) {
      if (err) return mResponse.error(res, err, 500, result);
      if (result.length == 0)
        return mResponse.sccuess(res, false, { result: [] });
      return mResponse.sccuess(res, true, { result: result });
    });
};

var updateDoc = function (collection, req, res) {
  try {
    var Model = model(collection);
  } catch (e) {
    console.log(e);
  }
  console.log(req.query);
  Model.updateOne(req.query, req.body, { new: true }, function (err, result) {
    if (err) return mResponse.error(res, err, 500, result);
    if (result.nModified > 0) return mResponse.sccuess(res, true);
    else return mResponse.sccuess(res, false);
  });
};

var patchDoc = function (collection, req, res) {
  try {
    var Model = model(collection);
  } catch (e) {
    console.log(e);
  }
  console.log(req.query);
  Model.updateOne(req.query, { $set: req.body }, function (err, result) {
    if (err) return mResponse.error(res, err, 500, result);
    if (result.nModified == "0") return mResponse.sccuess(res, false);
    else return mResponse.sccuess(res, true);
  });
};

var deleteDoc = function (collection, req, res) {
  try {
    var Model = model(collection);
  } catch (e) {
    console.log(e);
  }
  console.log(req.query);
  Model.deleteOne(req.query, function (err, result) {
    if (err) return mResponse.error(res, err, 500, result);
    if (result.deletedCount > 0) return mResponse.sccuess(res, true);
    else return mResponse.sccuess(res, false);
  });
};
router
  .get("/:collection/", RouteMiddleware, function (req, res) {
    var collection = req.params.collection;
    // if (req.userId == "60c82d0c625a4500043b05c7") {
    //   console.log("/profle udpate demo");
    //   return myRes.error(res, "\nRegister / Login To update profile", 500, {
    //     result: [],
    //   });
    // }
    findDocs(collection, req, res);
  })
  .get("/:collection/:id", RouteMiddleware, function (req, res) {
    var collection = req.params.collection;
    // if (req.userId == "60c82d0c625a4500043b05c7") {
    //   console.log("/profle udpate demo");
    //   return myRes.error(res, "\nRegister / Login To update profile", 500, {
    //     result: [],
    //   });
    // }
    findDocs(collection, req, res);
  })
  .post("/:collection", RouteMiddleware, function (req, res) {
    var collection = req.params.collection;
    // if (req.userId == "60c82d0c625a4500043b05c7") {
    //   console.log("/profle udpate demo");
    //   return myRes.error(res, "\nRegister / Login To update profile", 500, {
    //     result: [],
    //   });
    // }
    createDoc(collection, req.body, res);
  })
  .put("/:collection/:id", RouteMiddleware, function (req, res) {
    var collection = req.params.collection;
    // if (req.userId == "60c82d0c625a4500043b05c7") {
    //   console.log("/profle udpate demo");
    //   return myRes.error(res, "\nRegister / Login To update profile", 500, {
    //     result: [],
    //   });
    // }
    //var id = req.params.id;
    updateDoc(collection, req, res);
  })
  .patch("/:collection/:id", RouteMiddleware, function (req, res) {
    var collection = req.params.collection;
    //var id = req.params.id;
    // if (req.userId == "60c82d0c625a4500043b05c7") {
    //   console.log("/profle udpate demo");
    //   return myRes.error(res, "\nRegister / Login To update profile", 500, {
    //     result: [],
    //   });
    // }
    patchDoc(collection, req, res);
  })
  .delete("/:collection/:id", RouteMiddleware, function (req, res) {
    var collection = req.params.collection;
    //var id = req.params.id;
    // if (req.userId == "60c82d0c625a4500043b05c7") {
    //   console.log("/profle udpate demo");
    //   return myRes.error(res, "\nRegister / Login To update profile", 500, {
    //     result: [],
    //   });
    // }
    deleteDoc(collection, req, res);
  });

module.exports = router;
