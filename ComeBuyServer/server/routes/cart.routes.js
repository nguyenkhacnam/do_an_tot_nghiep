module.exports = app => {
    const cart = require("../controller/cart.controller");
    var router = require("express").Router();
    // Create a new product image
    router.post("/", cart.create);
    // Decrease amount in cart 
    router.post("/decrease", cart.decrease);
    // Retrieve all product images
    router.get("/", cart.findAll);
    // Retrieve a single product image with id
    router.get("/:id", cart.findOne);
    // Update a product image with id
    router.put("/:id", cart.update);
    // Delete a product image with id
    router.delete("/:id", cart.delete);
    // Delete all product images
    router.delete("/", cart.deleteAll);
    // Add feature for product image
    app.use('/api/cart', router);
  };