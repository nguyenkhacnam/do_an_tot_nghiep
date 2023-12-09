module.exports = app => {
    const authentication = require("../controller/authentication.controller");
    var router = require("express").Router();
    // login get accesToken
    router.post("/",authentication.login);
    // refreshToken
    router.post("/refreshToken", authentication.RefreshToken);
    // logout
    router.post("/logout", authentication.logout);
    app.use('/api/authentication', router);
  };