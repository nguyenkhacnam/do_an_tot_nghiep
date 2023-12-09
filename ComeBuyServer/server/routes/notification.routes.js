module.exports = app => {
    const notification = require("../controller/notification.controller");
    var router = require("express").Router();
    // Create a new product image
    router.post("/", notification.create);
    // Retrieve all product images
    router.get("/", notification.findAll);
    // Retrieve a single product image with id
    router.get("/:id", notification.findOne);
    // Update a product image with id
    router.put("/:id", notification.update);
    // Delete a product image with id
    router.delete("/:id", notification.delete);
    // Delete all product images
    router.delete("/", notification.deleteAll);
    // Add feature for product image
    app.use('/api/notification', router);
  };