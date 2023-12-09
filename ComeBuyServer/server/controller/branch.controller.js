const db = require("../models");
const Branch = db.branch;
const Account = db.account;
const Op = db.Sequelize.Op;
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const SendResponse = require('../utils/SendResponse');
// Create and Save a new Branch
const checkRole = async (userID) => {
    const response = await Account.findByPk(userID)
        .catch(err => {
            console.log(err)
            return false
        })
    return (response.role == 'manager') ? true : false;
}
exports.create = catchAsync(async (req, res, next) => {
    // Validate request
    if (!req.body.address || !req.body.userID) {
        next(new AppError({
            message: "Content can not be empty!"
        }, 400))
        return;
    }
    if (!await checkRole(userID)) next(new AppError("Account is not Manager!", 500))
    // Create a Branch
    const branch = {
        address: req.body.address,
        userid: req.body.userID
    };
    // Save Branch in the database
    const data = await Branch.create(branch)
    if (data) {
        SendResponse(data, 200, res)
    }
    else {
        next(new AppError("Some error occurred while creating the Branch.", 500))
    }
});
// Retrieve all Branchs from the database.
exports.findAll = (req, res) => {
    Branch.findAll({
        include: [
            {
                model: Account,
                as: "account",
                attributes: ["name", "email"],
            }
        ]
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Branchs."
            });
        });
};
// Find a single Branch with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Branch.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Branch with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Branch with id=" + id
            });
        });
};
// Update a Branch by the id in the request
exports.update = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    if (!await checkRole(req.body.userID)) {
        next(new AppError("Account is not Manager!", 500))
        return
    }
        const num = await Branch.update(req.body, {
            where: { branchID: id }
        })
            .catch(err => {
                next(new AppError("Error updating Branch with id=" + id + ", Error: " + err, 500))
            })
        if (num == 1)
            SendResponse("Branch was updated successfully.", 200, res)
        else
            next(new AppError(`Cannot update Branch with id=${id}. Maybe Branch was not found or req.body is empty!`, 500))
});
// Delete a Branch with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Branch.destroy({
        where: { branchid: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Branch was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Branch with id=${id}. Maybe Branch was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Branch with id=" + id
            });
        });
};
// Delete all Branchs from the database.
exports.deleteAll = (req, res) => {
    Branch.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Branchs were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Branchs."
            });
        });
};
