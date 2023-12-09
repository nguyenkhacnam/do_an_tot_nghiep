module.exports = (app) => {
  const favorite = require("../controller/favorite.controller");
  var router = require("express").Router();
  // Create a new product image
  router.post("/", favorite.create);
  // Decrease amount in favorite
  router.post("/decrease", favorite.decrease);
  // Retrieve all product images
  router.get("/", favorite.findAll);
  // Get by offset
  router.get("/:userID/:offset", favorite.findByOffset);
  // Retrieve a single product image with id
  router.get("/:id", favorite.findOne);
  // Update a product image with id
  router.put("/:id", favorite.update);
  // Delete a product image with id
  router.delete("/:id", favorite.delete);
  // Delete all product images
  router.delete("/", favorite.deleteAll);
  // Add feature for product image
  app.use("/api/favorite", router);
};
