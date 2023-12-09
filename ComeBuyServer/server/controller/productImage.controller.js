const db = require("../models");
const ProductImage = db.productimage;
const Op = db.Sequelize.Op;
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const SendResponse = require('../utils/SendResponse');
// Create and Save a new ProductImage
exports.create = (req, res) => {
    // Validate request
    if (!req.body.productID) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a ProductImage
    const productImage = {
        productid: req.body.productID,
        imageURL: req.body.imageURL
    };
    // console.log(productImage)
    // Save ProductImage in the database
    ProductImage.create(productImage)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the ProductImage."
            });
        });
};
// Retrieve all ProductImages from the database.
exports.findAll = (req, res) => {
    const name = req.query.productID;
    var condition = name ? { productID: { [Op.iLike]: `%${name}%` } } : null;
    ProductImage.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving ProductImages."
            });
        });
};
// Find a single ProductImage with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    ProductImage.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find ProductImage with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving ProductImage with id=" + id
            });
        });
};
// Update a ProductImage by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    ProductImage.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "ProductImage was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update ProductImage with id=${id}. Maybe ProductImage was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating ProductImage with id=" + id
            });
        });
};
// Delete a ProductImage with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    ProductImage.destroy({
        where: { productImageID: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "ProductImage was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete ProductImage with id=${id}. Maybe ProductImage was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete ProductImage with id=" + id
            });
        });
};
// Delete all ProductImages from the database.
exports.deleteAll = (req, res) => {
    ProductImage.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} ProductImages were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all ProductImages."
            });
        });
};

exports.deleteImagesOfProduct = catchAsync(async (req, res, next) => {
    const id = req.params.productID;
    const data = await ProductImage.destroy({
        where: { productid: id }
    }).catch(err => {
        next(new AppError("Error delete ProductImage with ProductID=" + id, 500));
    })
    if (data >= 1) {
        SendResponse({ message: "ProductImage was deleted successfully!" }, 200, res)
    } 
    else if (data == 0)  SendResponse({ message: "Maybe, There is no image for this product!" }, 200, res)
    else {
        return new AppError(`Cannot delete ProductImage with Product=${id}`, 400);
    }
});

exports.AddManyImage = catchAsync(async (req,res,next) => {
    const Images = req.body;
    const data = await ProductImage.bulkCreate(Images , {returning: true}).catch(err => {
        next(new AppError("Error Add Many ProductImage with ProductID", 500));
    })
    if (data) SendResponse(data,200,res)
    else  next(new AppError("Error Add Many Images ProductID", 400));

})
