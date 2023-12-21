const db = require("../models");
const Invoice = db.invoice;
const Account = db.account;
const Product = db.product;
const Branch = db.branch;
const Stock = db.stock;
const InvoiceItem = db.invoiceitem;
const t = require("../helpers/transaction");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const SendResponse = require('../utils/SendResponse');

exports.createInvoice = async (req, res) => {
    const transaction = await t.create();
    let listProdId = [];
    let resultFilterRemain = [];
    let resultFilterNonRemain = [];
    try {
        if (!req.body.branchID || !req.body.userID || !req.body.address || req.body?.listGoods?.length === 0) {
            console.log('undefined')
            res.status(400).send({
                message: "Invoice controller >> create invoice failed >> lack of information!"
            });
            return;
        }
        const listProds = req.body.listGoods;
        listProds?.map(i => listProdId.push(i.productid));
        const invoice = {
            date: req.body.date,
            total: req.body.total,
            moneyReceived: req.body.moneyReceived,
            isChecked: req.body.isChecked,
            isPaid: req.body.isPaid,
            userid: req.body.userID,
            branchid: req.body.branchID,
            address: req.body.address
        };
        if (!transaction.status && transaction.error) {
            throw transaction.error;
        }
        const remain = await Stock.findAll({
            where: {
                productid: listProdId,
                branchid: invoice.branchid,
            },
            include: [{
                model: Product,
                as: "product",
                attributes: ['name', 'price']
            }]
        });
        listProds?.map(pro1 => {
            remain.map(pro2 => {
                if (pro2.productid === pro1.productid && pro2.remaining < pro1.quantity) {
                    resultFilterNonRemain.push(pro2);
                } else {
                    resultFilterRemain.push({
                        productid: pro2.productid,
                        amount: pro1.quantity,
                        total: pro2.product.price * pro1.quantity
                    });
                }
            })
        })
        const createInvoice = await Invoice.create(invoice, { transaction: transaction.data });

        if (resultFilterNonRemain.length != 0) {
            await t.rollback(transaction.data);
            return res.status(400).send({
                status: 'error',
                message: 'There is product that does not have enough quantity to supply',
                data: resultFilterNonRemain
            });
        } else if (!createInvoice) {
            await t.rollback(transaction.data);
            return next(new AppError("Invoice controller >> create invoice failed "), 404)
        } else {
            const commit = await t.commit(transaction.data);
            if (!commit.status && commit.error) {
                throw commit.error;
            }
            SendResponse({
                status: 'success',
                data: createInvoice
            }, 200, res)
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Invoice."
        })
    }
}

exports.createInvoiceItem = async (req, res) => {
    const transaction = await t.create();
    try {
        if (!req.body.invoiceID || !req.body.productID) {
            res.status(400).send({
                message: "Invoice controller >> create invoice item failed!"
            });
            return;
        }
        if (!transaction.status && transaction.error) {
            throw transaction.error;
        }
        const invoiceItem = {
            invoiceid: req.body.invoiceID,
            productid: req.body.productID,
            amount: req.body.amount,
            total: req.body.total
        };
        // const existInvoice = await Invoice.findOne({
        //     where: {
        //         invoiceid: req.body.invoiceID
        //     }
        // }, { transaction: transaction.data });
        // const existProduct = await Product.findOne({
        //     where: {
        //         productid: req.body.productID
        //     }
        // }, { transaction: transaction.data });
        const createInvoiceItem = await InvoiceItem.create(invoiceItem, { transaction: transaction.data });
        // if (!existInvoice || !existProduct) {
        //     await t.rollback(transaction.data);
        //     SendResponse({
        //         status: 'error',
        //         message: 'Invoice controller >> create invoice item failed!'
        //     }, 404, res)
        // } else {
        // }
        const commit = await t.commit(transaction.data);
        if (!commit.status && commit.error) {
            throw commit.error;
        }
        SendResponse({
            status: 'success',
            data: createInvoiceItem
        }, 200, res)
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while creating the Invoice item."
        })
    }
}

exports.findAllInvoice = async (req, res) => {
    const transaction = await t.create();
    try {
        if (!transaction.status && transaction.error) {
            throw transaction.error;
        }
        const allInvoice = await Invoice.findAll({
            include: [
                {
                    model: Account,
                    as: "account",
                    attributes: ["userid", "name"],
                },
                {
                    model: Branch,
                    as: "branch",
                    attributes: ["branchid", "address"],

                },
                {
                    model: InvoiceItem,
                    as: "invoiceitem",
                    attributes: ["productid", "total", "amount"],
                }
            ]
        }, { transaction: transaction.data });
        console.log('allInvoice', allInvoice);
        if (!allInvoice) {
            await t.rollback(transaction.data);
            SendResponse({
                status: 'error',
                message: 'Invoice controller >> Retrieve all invoice failed!'
            }, 404, res)
        } else {
            const commit = await t.commit(transaction.data);
            if (!commit.status && commit.error) {
                throw commit.error;
            }
            SendResponse({
                status: 'success',
                data: allInvoice
            }, 200, res)
        }
    } catch (error) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Invoices."
        });
    }
};

exports.findInvoiceById = async (req, res) => {
    const id = req.params.id;
    const transaction = await t.create();
    try {
        if (!transaction.status && transaction.error) {
            throw transaction.error;
        }
        const invoice = await Invoice.findByPk(id, { transaction: transaction.data });
        if (!invoice) {
            await t.rollback(transaction.data);
            SendResponse({
                status: 'error',
                message: 'Invoice controller >> Retrieve invoice with id failed!'
            }, 404, res)
        } else {
            const commit = await t.commit(transaction.data);
            if (!commit.status && commit.error) {
                throw commit.error;
            }
            SendResponse({
                status: 'success',
                data: invoice
            }, 200, res)
        }
    } catch (error) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Invoices."
        });
    }
};

exports.updateInvoice = async (req, res) => {
    const transaction = await t.create();
    const id = req.params.id;
    try {
        if (!transaction.status && transaction.error) {
            throw transaction.error;
        }
        const updateInvoice = await Invoice.update(req.body, {
            where: { invoiceID: id }
        }, { transaction: transaction.data });
        if (!updateInvoice) {
            await t.rollback(transaction.data);
            SendResponse({
                status: 'error',
                message: 'Invoice controller >> Update invoice with id failed!'
            }, 404, res)
        } else {
            const commit = await t.commit(transaction.data);
            if (!commit.status && commit.error) {
                throw commit.error;
            }
            SendResponse({
                status: 'success',
                data: updateInvoice
            }, 200, res)
        }
    } catch (error) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while update invoice by id."
        });
    }
};

exports.deleteInvoice = async (req, res) => {
    const id = req.params.id;
    const transaction = await t.create();

    try {
        if (!transaction.status && transaction.error) {
            throw transaction.error;
        }
        const deleteInvoice = await Invoice.destroy({
            where: { invoiceID: id }
        }, { transaction: transaction.data });
        if (!deleteInvoice) {
            await t.rollback(transaction.data);
            SendResponse({
                status: 'error',
                message: 'Invoice controller >> Delete invoice with id failed!'
            }, 404, res)
        } else {
            const commit = await t.commit(transaction.data);
            if (!commit.status && commit.error) {
                throw commit.error;
            }
            SendResponse({
                status: 'success',
                data: deleteInvoice
            }, 200, res)
        }
    } catch (error) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while update invoice by id."
        });
    }
};

exports.deleteAll = async (req, res) => {
    const transaction = await t.create();
    try {
        if (!transaction.status && transaction.error) {
            throw transaction.error;
        }
        const deleteAllInvoice = await Invoice.destroy({
            where: {}
        }, { transaction: transaction.data });
        if (!deleteAllInvoice) {
            await t.rollback(transaction.data);
            SendResponse({
                status: 'error',
                message: 'Invoice controller >> Delete all invoice failed!'
            }, 404, res)
        } else {
            const commit = await t.commit(transaction.data);
            if (!commit.status && commit.error) {
                throw commit.error;
            }
            SendResponse({
                status: 'success',
                data: deleteAllInvoice
            }, 200, res)
        }
    } catch (error) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while update invoice by id."
        });
    }
};

exports.getRevenueInBrach = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const data = await Invoice.findAll({
        where: { branchid: id },
        include: [
            {
                model: Account,
                as: "account",
                attributes: ["userid", "name"],
            },
            {
                model: InvoiceItem,
                as: "invoiceitem",
                attributes: ["productid", "total", "amount"],

            }
        ]
    }).catch(err => {
        next(new AppError("Error : " + err, 500))
    })
    if (data) {
        let result = []
        data.map((item) => result = result.concat(item.invoiceitem))
        result = result.filter((item) => item.productid != null)
        let result2 = []
        for (i = 0; i < result.length; i++) {
            let checker = result2.some(e => e.name == result[i].productid)
            if (!checker) {
                result2.push({
                    name: result[i].productid,
                    Profit: result[i].total,
                    Amount: result[i].amount,
                })
            }
            else {
                result2 = result2.map((item) => {
                    if (item.name == result[i].productid) {
                        return {
                            name: result[i].productid,
                            Profit: Number(result[i].total) + Number(item.Profit),
                            Amount: Number(result[i].amount) + Number(item.Amount),
                        }
                    }
                    else return item
                })
            }
        }
        SendResponse(result2, 200, res)
    }
    else {
        next(new AppError("Wrong branch", 404))
    }
});
