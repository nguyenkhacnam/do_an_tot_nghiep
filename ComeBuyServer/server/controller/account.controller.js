const db = require("../models");
const Account = db.account;
const Notification = db.notification;
const Cart = db.cart;
const Op = db.Sequelize.Op;
const Branch = db.branch;
const Favorite = db.favorite;
const aes256 = require("aes256");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const SendResponse = require("../utils/SendResponse");
const { isEmpty } = require("../utils/validate");
// Create and Save a new Account
exports.create = catchAsync(async (req, res, next) => {
  // Validate request
  if (!req.body.name || !req.body.email || !req.body.password) {
    next(new AppError("Some params is missing or null!", 404));
    return;
  }
  // else if (req.body.role == 'admin') {
  //   next(new AppError("Role is not allowed to be admin", 500))
  //   return;
  // }
  // Create a Account
  const account = {
    name: req.body.name,
    description: req.body.description,
    dob: req.body.dob,
    avatar: req.body.avatar,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    password: aes256
      .encrypt(process.env.SECRET_KEY_HASH, req.body.password)
      .toString(),
    bio: req.body.bio,
    address: req.body.address,
    role: req.body.role,
    sex: req.body.sex,
    score: 0,
  };
  // Save Account in the database
  const result = await Account.findOne({ where: { email: req.body.email } });
  if (result == null) {
    /// Handle Manager Role
    if (req.body.role == "manager") {
      if (isEmpty(req.body.branchAddress) && req.body.branchID == "")
        next(new AppError("Branch address is null or empty", 405));
      else {
        const response = await Account.create(account);
        if (response) {
          /// new branch
          if (req.body.branchAddress != "") {
            const branch = {
              address: req.body.branchAddress,
              userid: response.userID,
            };
            const data = await Branch.create(branch);
            if (data)
              SendResponse(
                "Add Manager with new branch successfully",
                200,
                res
              );
            else
              next(
                new AppError(
                  "Some error occurred while creating the Branch.",
                  500
                )
              );
          }
          /// existed branch
          else {
            const num = await Branch.update(
              {
                userid: response.userID,
                branchID: req.body.branchID,
              },
              { where: { branchID: req.body.branchID } }
            ).catch(err => {
              next(
                new AppError(
                  "Error updating Branch with id=" + id + ", Error: " + err,
                  500
                )
              );
            });
            if (num == 1)
              SendResponse(
                "Add Manager with existed branch successfully",
                200,
                res
              );
            else
              next(
                new AppError(
                  "Some error occurred while creating the Branch.",
                  500
                )
              );
          }
        } else
          next(
            new AppError("Some error occurred while creating the Account.", 500)
          );
      }
    }
    ///// Handle Another Role != Manager
    else {
      const response = await Account.create(account);
      if (response) SendResponse(response, 200, res);
      else
        next(
          new AppError("Some error occurred while creating the Account.", 500)
        );
    }
  } else next(new AppError("Account is Existed!", 409));
});
// Retrieve all Accounts from the database.
exports.findAll = catchAsync(async (req, res, next) => {
  const data = await Account.findAll({
    include: [
      {
        model: Notification,
        as: "notification",
        attributes: ["userID", "body", "notiid"],
      },
      {
        model: Cart,
        as: "cart",
        attributes: ["productid", "amount"],
      },
      {
        model: Branch,
        as: "branch",
        attributes: ["branchid", "address"],
      },
      {
        model: Favorite,
        as: "favorite",
        attributes: ["productid"],
      },
    ],
  }).catch(err => next(new AppError("Error: " + err, 500)));

  if (data) SendResponse(data, 200, res);
  else
    return next(
      new AppError("Some error occurred while retrieving Accounts.", 404)
    );
});
// Find a single Account with an id
exports.findOne = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  if (id == null)
    return next(new AppError("Error retrieving Account with id=" + id, 400));

  const data = await Account.findByPk(id, {
    include: [
      {
        model: Notification,
        as: "notification",
        attributes: ["userID", "body", "notiid"],
      },
      {
        model: Cart,
        as: "cart",
        attributes: ["productid", "amount"],
      },
      {
        model: Branch,
        as: "branch",
        attributes: ["branchid", "address"],
      },
    ],
  });
  if (data) SendResponse(data, 200, res);
  else return next(new AppError(`Cannot find Account with id=${id}.`, 404));
});

exports.findOnebyEmail = catchAsync(async (req, res, next) => {
  const email = req.params.email;
  const data = await Account.findOne({
    where: { email: email },
    include: [
      {
        model: Notification,
        as: "notification",
        attributes: ["userID", "body", "notiid"],
      },
      {
        model: Cart,
        as: "cart",
        attributes: ["productid", "amount"],
      },
      {
        model: Branch,
        as: "branch",
        attributes: ["branchid", "address"],
      },
    ],
  }).catch(err => {
    next(
      new AppError(
        "Error retrieving Account with id=" + id + " Error: " + err,
        500
      )
    );
  });
  if (data) SendResponse(data, 200, res);
  else next(new AppError(`Cannot find Account with email=${email}.`, 404));
});
// Update a Account by the id in the request
exports.update = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  if (req.body.password) {
    delete req.body.password;
    delete req.body.email;
  }

  const num = await Account.update(req.body, { where: { userID: id } }).catch(
    err => {
      next(new AppError("Error updating Account with id=" + id, 500));
    }
  );
  if (num == 1) {
    const data = await Account.findByPk(id, {
      include: [
        {
          model: Notification,
          as: "notification",
          attributes: ["userID", "body", "notiid"],
        },
        {
          model: Cart,
          as: "cart",
          attributes: ["productid", "amount"],
        },
      ],
    });
    if (!data) next(new AppError(`Error Get new Product`, 404));
    else SendResponse(data, 200, res);
  } else {
    next(
      new AppError(
        `Cannot update Account with id=${id}. Maybe Account was not found or req.body is empty!`,
        404
      )
    );
  }
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  aes256_password = aes256
    .encrypt(process.env.SECRET_KEY_HASH, req.body.password)
    .toString();

  const num = await Account.update(
    { password: aes256_password },
    { where: { userID: id } }
  ).catch(err => {
    next(new AppError("Error updating Account with id=" + id, 500));
  });
  if (num == 1) {
    const data = await Account.findByPk(id, {
      include: [
        {
          model: Notification,
          as: "notification",
          attributes: ["userID", "body", "notiid"],
        },
        {
          model: Cart,
          as: "cart",
          attributes: ["productid", "amount"],
        },
      ],
    });
    if (!data) next(new AppError(`Error Update Password`, 404));
    else SendResponse(data, 200, res);
  } else {
    next(
      new AppError(
        `Cannot update password for Account with id=${id}. Maybe Account was not found or req.body is empty!`,
        404
      )
    );
  }
});
// Delete a Account with the specified id in the request
exports.delete = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const num = await Account.destroy({
    where: { userID: id },
  }).catch(err => {
    next(
      new AppError(
        "Could not delete Account with id=" + id + "error:" + err,
        500
      )
    );
  });

  if (num == 1) {
    SendResponse("Account was deleted successfully!", 200, res);
  } else {
    next(
      new AppError(
        `Cannot delete Account with id=${id}. Maybe Account was not found!`,
        404
      )
    );
  }
});
// Delete all Accounts from the database.
exports.deleteAll = (req, res) => {
  Account.destroy({
    where: {},
    truncate: false,
  })
    .then(nums => {
      res.send({ message: `${nums} Accounts were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Accounts.",
      });
    });
};
