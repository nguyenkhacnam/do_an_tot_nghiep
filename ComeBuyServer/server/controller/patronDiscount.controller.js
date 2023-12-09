const db = require("../models");
const PatronDiscount = db.patrondiscount;
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const SendResponse = require('../utils/SendResponse');
// Create and Save a new PatronDiscount
exports.create = catchAsync(async (req, res, next) => {
    // Validate request
    if (!req.body.memberShipRank || !req.body.percentDiscount || !req.body.base) {
        next(new AppError("Some params is null or empty", 404))
    }
    // Create a Comment
    const newPatronDiscount = {
        base: req.body.base,
        memberShipRank: req.body.memberShipRank,
        percentDiscount: req.body.percentDiscount
    };
    // Save Comment in the database
    const data = await PatronDiscount.create(newPatronDiscount)
        .catch(err =>
            next(new AppError(err, 500)))
    if (data) {
        SendResponse(data, 200, res)
    }
    else {
        next(new AppError("Some error occurred while creating the PatronDiscount.", 500))
    }
});

// Retrieve all PatronDiscounts from the database.
exports.findAll = catchAsync(async (req, res, next) => {
    const data = await PatronDiscount.findAll().catch(err =>
        next(new AppError(err, 500)))

    if (data) {
        SendResponse(data, 200, res)
    }
    else {
        next(new AppError("Some error occurred while retrieving PatronDiscounts.", 500))
    }
});
// Find a single PatronDiscount with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    PatronDiscount.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find PatronDiscount with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving PatronDiscount with id=" + id
            });
        });
};
// Update a PatronDiscount by the id in the request
exports.update = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const num = await PatronDiscount.update({ remaining: req.body.remaining, totalAmount: req.body.totalAmount }, {
        where: { id: id }
    }).catch(err =>
        next(new AppError("Error: " + err, 500)))

    if (num == 1)
        SendResponse("PatronDiscount was updated successfully.", 200, res)
    else next(new AppError(`Cannot update PatronDiscount with id=${id}. Maybe PatronDiscount was not found or req.body is empty!`, 404))
});
// Delete a PatronDiscount with the specified id in the request
exports.delete = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const num = await PatronDiscount.destroy({
        where: { id: id }
    }).catch(err =>
        next(new AppError("Error : " + err, 500)))

    if (num == 1)
        SendResponse("PatronDiscount was deleted successfully!", 200, res)
    else next(new AppError(`Cannot delete PatronDiscount with id=${id}. Maybe PatronDiscount was not found!`, 404))
});
// Delete all PatronDiscounts from the database.
exports.deleteAll = (req, res) => {
    PatronDiscount.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} PatronDiscounts were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all PatronDiscounts."
            });
        });
};
