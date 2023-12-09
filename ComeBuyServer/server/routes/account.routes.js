const { authenToken } = require("../middlewares/authenMiddleware");

module.exports = app => {
  const accounts = require("../controller/account.controller");
  var router = require("express").Router();
  // Create a new account
  router.post("/", accounts.create);
  // Retrieve all computers
  router.get("/", authenToken, accounts.findAll);
  // Retrieve a single account with id
  router.get("/:id", authenToken, accounts.findOne);
  // Retrieve a single account with id
  router.get("/email/:email", accounts.findOnebyEmail);
  // Update a account with id
  router.put("/:id", authenToken, accounts.update);
  /// Update password
  router.put("/updatePassword/:id", accounts.updatePassword);
  // Delete a account with id
  router.delete("/:id", authenToken, accounts.delete);
  // Delete all accounts 
  router.delete("/", authenToken, accounts.deleteAll);
  app.use('/api/account', router);
};