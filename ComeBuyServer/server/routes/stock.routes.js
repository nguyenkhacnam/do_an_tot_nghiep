module.exports = app => {
    const stock = require("../controller/stock.controller");
    var router = require("express").Router();
    // Create a new stock
    router.post("/", stock.create);
    // Retrieve all stocks
    router.get("/", stock.findAll);
    // Retrieve a single stock with id
    router.get("/:id", stock.findOne);
    // Retrieve all stock by id 
    router.get("/FindByBranch/:id", stock.findbyBranch);
    // Update a stock with id
    router.put("/:id", stock.update);
    // Delete a stock with id
    router.delete("/:id", stock.delete);
    // Delete all stocks 
    router.delete("/", stock.deleteAll);
    // Delete and update feature stock
    app.use('/api/stock', router);
  };