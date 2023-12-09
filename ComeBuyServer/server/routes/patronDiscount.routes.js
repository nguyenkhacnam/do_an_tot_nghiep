module.exports = app => {
    const patronDiscount = require("../controller/patronDiscount.controller");
    var router = require("express").Router();

    router.post("/", patronDiscount.create);
    // Retrieve all product images
    router.get("/", patronDiscount.findAll);
    app.use('/api/patronDiscount', router);
  };