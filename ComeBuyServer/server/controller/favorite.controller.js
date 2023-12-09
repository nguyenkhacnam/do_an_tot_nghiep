const db = require("../models");
const Favorite = db.favorite;
const Account = db.account;
const Product = db.product;
const Op = db.Sequelize.Op;
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const SendResponse = require("../utils/SendResponse");
const SendBroadCast = require("../utils/SendBroadCast");
const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

// Create and Save a new Favorite
exports.create = (req, res) => {
  // Validate request
  if (!req.body.userID || !req.body.productID) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  Favorite.findOne({
    where: { productid: req.body.productID, userid: req.body.userID },
  })
    .then((data) => {
      if (data == null) {
        const favorite = {
          userid: req.body.userID,
          productid: req.body.productID,
        };
        Favorite.create(favorite)
          .then((data) => {
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while creating the Favorite.",
            });
          });
      } else {
        let _amount = data.amount;
        Favorite.update(
          { amount: _amount + 1 },
          {
            where: { productid: req.body.productID, userid: req.body.userID },
          }
        )
          .then((num) => {
            if (num == 1) {
              res.send({
                message: "Favorite was updated successfully.",
              });
            } else {
              res.send({
                message: `Cannot update Favorite with id=${req.body.productID}. Maybe Favorite was not found or req.body is empty!`,
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error updating Favorite with id=" + req.body.productID,
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Favorite.",
      });
    });
};
exports.decrease = (req, res) => {
  // Validate request
  if (!req.body.userID || !req.body.productID) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  Favorite.findOne({
    where: { productID: req.body.productID, userID: req.body.userID },
  })
    .then((data) => {
      if (data == null) {
        res.send("There is no this product in your Favorite");
      } else {
        let _amount = data.amount;
        if (_amount == 1) {
          Favorite.destroy({
            where: { productID: req.body.productID, userID: req.body.userID },
          })
            .then((num) => {
              if (num == 1) {
                res.send({
                  message: "Favorite was deleted successfully!",
                });
              } else {
                res.send({
                  message: `Cannot delete Favorite with id=${id}. Maybe Favorite was not found!`,
                });
              }
            })
            .catch((err) => {
              res.status(500).send({
                message: "Could not delete Favorite with id=" + id,
              });
            });
        } else {
          Favorite.update(
            { amount: _amount - 1 },
            {
              where: { productID: req.body.productID, userID: req.body.userID },
            }
          )
            .then((num) => {
              if (num == 1) {
                res.send({
                  message: "Favorite was updated successfully.",
                });
              } else {
                res.send({
                  message: `Cannot update Favorite with id=${id}. Maybe Favorite was not found or req.body is empty!`,
                });
              }
            })
            .catch((err) => {
              res.status(500).send({
                message: "Error updating Favorite with id=" + id,
              });
            });
        }
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Favorite.",
      });
    });
  // // Create a Favorite
  // const Favorite = {
  //     userID: req.body.userID,
  //     productID : req.body.productID,
  //     amount: req.body.amount
  // };
  // // Save Favorite in the database
  // Favorite.create(Favorite)
  //     .then(data => {
  //         res.send(data);
  //     })
  //     .catch(err => {
  //         res.status(500).send({
  //             message:
  //                 err.message || "Some error occurred while creating the Favorite."
  //         });
  //     });
};
// Retrieve all Favorites from the database.
exports.findAll = (req, res) => {
  Favorite.findAll({
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["name"],
      },
      {
        model: Account,
        as: "account",
        attributes: ["name"],
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Favorites.",
      });
    });
};

exports.findByOffset = catchAsync(async (req, res, next) => {
  const query = `
    select *, (select count(*) from favorite where userid = :userID) AS total 
    from favorite
    where userid = :userID
    offset :offset limit 3
    `;
  const response = await sequelize.query(query, {
    model: Favorite,
    mapToModel: true,
    replacements: {
      userID: req.params.userID,
      offset: (req.params.offset - 1) * 3,
    },
    type: QueryTypes.SELECT,
  });

  if (response) {
    SendResponse(response, 200, res);
  } else
    next(
      new AppError(
        {
          message:
            err.message || "Some error occurred while creating the Product.",
        },
        500
      )
    );
});
// Find a single Favorite with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Favorite.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Favorite with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Favorite with id=" + id,
      });
    });
};
// Update a Favorite by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Favorite.update(req.body, {
    where: { FavoriteID: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Favorite was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Favorite with id=${id}. Maybe Favorite was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Favorite with id=" + id,
      });
    });
};
// Delete a Favorite with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Favorite.destroy({
    where: { favoriteID: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Favorite was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Favorite with id=${id}. Maybe Favorite was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Favorite with id=" + id,
      });
    });
};
// Delete all Favorites from the database.
exports.deleteAll = (req, res) => {
  Favorite.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Favorites were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Favorites.",
      });
    });
};
