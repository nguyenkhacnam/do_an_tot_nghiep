module.exports = app => {
    const banner = require("../controller/banner.controller");
    var router = require("express").Router();

    router.post("/", banner.create);
    // Retrieve all product images
    router.get("/", banner.findAll);
    // Delete banner
    router.delete("/:id", banner.deleteBanner);
    app.use('/api/banner', router);
  };