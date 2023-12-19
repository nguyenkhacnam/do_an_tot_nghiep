const { authenToken } = require("../middlewares/authenMiddleware");

module.exports = (app) => {
  const product = require("../controller/product.controller");
  var router = require("express").Router();
  // Create a new product
  router.post("/", authenToken, product.create);
  // Retrieve all products
  router.get("/", product.findAll);
  // Retrieve a single product with id
  router.get("/:id", product.findOne);
  // Get best-selling product
  router.get("/get/best-selling", product.getBestSellingProduct);
  // Update a product with id
  router.put("/:id", 
  // authenToken, 
  product.update);
  // Delete a product with id
  router.delete("/:id", authenToken, product.delete);
  // Delete all products
  router.delete("/", authenToken, product.deleteAll);
  // Delete and update feature product
  router.post(
    "/DeleteAndUpdate/Feature",
    // authenToken,
    product.deleteAndUpdateFeature
  );
  // Add feature for product
  router.put("/:productId/:featureId", authenToken, product.addFeature);
  // Filter with condition and get limit samples from offset
  router.post("/filter", product.filter);
  // Get Features all product
  router.get("/filter/feature", product.getAllFeature);
  app.use("/api/product", router);
};
