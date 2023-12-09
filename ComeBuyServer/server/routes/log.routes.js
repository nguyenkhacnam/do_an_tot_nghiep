module.exports = (app) => {
  const log = require("../controller/log.controller");
  var router = require("express").Router();
  router.get("/:userID/:offset", log.findById);
  app.use("/api/log", router);
};
