const db = require("../models");
const Comment = db.comment;
const Account = db.account;
const Op = db.Sequelize.Op;
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const SendResponse = require("../utils/SendResponse");
const axios = require("axios");
// Create and Save a new Comment
exports.create = catchAsync(async (req, res, next) => {
  // Validate request
  if (!req.body.body || !req.body.productID || !req.body.userID) {
    next(new AppError("Content can not be empty!", 400));
    return;
  }
  const status_response = await axios.post(
    "https://comebuyaiserver.herokuapp.com/sentiment",
    {
      sentence: req.body.body,
    }
  );
  // Create a Comment
  if (status_response) {
    console.log(status_response.data.result);
    var comment = {
      productid: req.body.productID,
      userid: req.body.userID,
      body: req.body.body,
      postDate: req.body.postDate,
      status: status_response.data.result,
    };
  } else {
    console.log(status_response.data.result);
    var comment = {
      productid: req.body.productID,
      userid: req.body.userID,
      body: req.body.body,
      postDate: req.body.postDate,
    };
  }
  // Save Comment in the database
  const data = await Comment.create(comment);
  if (data) {
    const listComment = await Comment.findAll({
      where: { productid: req.body.productID },
      include: [
        {
          model: Account,
          as: "account",
          attributes: ["name", "email", "avatar"],
        },
      ],
    });
    if (listComment) {
      SendResponse(listComment, 200, res);
    } else next(new AppError("Error Load Comment", 500));
  } else
    next(new AppError("Some error occurred while creating the Comment.", 500));
});
// Retrieve all Comments from the database.
exports.findAll = (req, res) => {
  Comment.findAll({
    include: [
      {
        model: Account,
        as: "account",
        attributes: ["name", "email"],
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Comments.",
      });
    });
};
// Find a single Comment with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Comment.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Comment with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Comment with id=" + id,
      });
    });
};
//Find comment by product id
exports.findByProductID = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const data = await Comment.findAll({
    where: { productid: req.params.id },
    include: [
      {
        model: Account,
        as: "account",
        attributes: ["userid", "name", "avatar"],
      },
    ],
  }).catch((err) =>
    next(new AppError("Error retrieving Comment with id=" + id, 500))
  );

  if (data) SendResponse(data, 200, res);
  else next(new AppError(`Cannot find Comment with id=${id}.`, 404));
});

// Update a Comment by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Comment.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Comment was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Comment with id=${id}. Maybe Comment was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Comment with id=" + id,
      });
    });
};
// Delete a Comment with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Comment.destroy({
    where: { commentid: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Comment was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Comment with id=${id}. Maybe Comment was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Comment with id=" + id,
      });
    });
};
// Delete all Comments from the database.
exports.deleteAll = (req, res) => {
  Comment.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Comments were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Comments.",
      });
    });
};
