class MyResponse {
  sccuess = function (res, val = false, result = { result: [] }) {
    return res.status(200).send({
      status: "ok",
      success: val,
      message: "",
      ...result,
    });
  };

  error = function (res, error = "", type = 500, result = { result: [] }) {
    return res.status(type).send({
      status: "ok",
      success: false,
      message: "There was a problem in action." + error,
      ...result,
    });
  };
}
module.exports = new MyResponse();
