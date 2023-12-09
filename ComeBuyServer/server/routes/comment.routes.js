module.exports = app => {
    const comments = require("../controller/comment.controller");
    var router = require("express").Router();
    // Create a new product image
    router.post("/", comments.create);
    // Retrieve all product images
    router.get("/", comments.findAll);
    // Retrieve a single product image with id
    router.get("/:id", comments.findOne);
    // Retrieve a comment by product id 
    router.get("/findByProductID/:id", comments.findByProductID);
    // Update a product image with id
    router.put("/:id", comments.update);
    // Delete a product image with id
    router.delete("/:id", comments.delete);
    // Delete all product images
    router.delete("/", comments.deleteAll);
    // Add feature for product image
    app.use('/api/comment', router);
  };