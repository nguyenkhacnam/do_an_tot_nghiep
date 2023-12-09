const db = require("../models");
const Banner = db.banner;
const Account = db.account;
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const SendResponse = require("../utils/SendResponse");
const SendBroadCast = require("../utils/SendBroadCast");
const SaveLog = require("../utils/SaveLog");
// Create and Save a new PatronDiscount
exports.create = catchAsync(async (req, res, next) => {
  // Validate request
  if (!req.body.url && req.body.url != null) {
    next(new AppError("Some params is null or empty", 404));
  }
  // Create a Comment
  const newBanner = {
    url: req.body.url,
  };
  // Save Comment in the database
  const data = await Banner.create(newBanner).catch((err) =>
    next(new AppError(err, 500))
  );
  if (data) {
    SendBroadCast({
      proxy: process.env.WEBSOCKET,
      body: { destination: "update-new-banner", data: data },
    });
    const adminAccount = await Account.findOne({
      where: { role: "admin" },
    });
    SaveLog({
      action: "Add new banner successfully!",
      userID: adminAccount.userID,
      role: "admin",
    });
    SendResponse(data, 200, res);
  } else {
    next(new AppError("Some error occurred while creating the Banner.", 500));
  }
});

// Retrieve all PatronDiscounts from the database.
exports.findAll = catchAsync(async (req, res, next) => {
  const data = await Banner.findAll().catch((err) =>
    next(new AppError(err, 500))
  );

  if (data) {
    SendResponse(data, 200, res);
  } else {
    next(new AppError("Some error occurred while retrieving banner.", 500));
  }
});

exports.deleteBanner = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const data = await Banner.destroy({
    where: { bannerID: id },
  }).catch((err) => next(new AppError(err, 500)));

  if (data == 1) {
    SendBroadCast({
      proxy: process.env.WEBSOCKET,
      body: { destination: "delete-banner", data: id },
    });
    SendResponse("Delete Successfully", 200, res);
    const adminAccount = await Account.findOne({ where: { role: "admin" } });
    SaveLog({
      action: "Delete banner successfully!",
      userID: adminAccount.userID,
      role: "admin",
    });
  } else {
    next(new AppError("Some error occurred while delete banner.", 500));
  }
});
