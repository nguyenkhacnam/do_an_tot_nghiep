module.exports = app => {
    const features = require("../controller/feature.controller");
    var router = require("express").Router();
    // Create a new Feature
    router.post("/", features.create);
    // Retrieve all Features
    router.get("/", features.findAll);
    // // Retrieve all published Features
    // router.get("/published", computers.findAllPublished);
    // Retrieve a single Feature with id
    router.get("/:id", features.findOne);
    // Update a Feature with id
    router.put("/:id", features.update);
    // Delete a Feature with id
    router.delete("/:id", features.delete);
    // Delete all Features 
    router.delete("/", features.deleteAll);
    app.use('/api/feature', router);
  };