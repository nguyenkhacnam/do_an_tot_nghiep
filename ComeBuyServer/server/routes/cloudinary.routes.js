const { cloudinary } = require("../config/cloudinary.config");

module.exports = app => {
    const cloundinary = require("../controller/cloudinary.controller");
    var router = require("express").Router();
    // Upload images
    router.post("/", cloundinary.uploadImages);
    router.post("/big", cloundinary.uploadBigImages)
    app.use('/api/cloudinary', router);
};

