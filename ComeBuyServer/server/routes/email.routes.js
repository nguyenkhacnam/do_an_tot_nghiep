module.exports = app => {
    const email = require("../controller/email.controller");
    var router = require("express").Router();
    // Sending an email
    router.post("/verify", email.sendVerify);
    router.post("/sendOrder", email.sendOrder);
    app.use('/api/email', router);
};