module.exports = (sequelize, Sequelize) => {
    const Stock = sequelize.define("stock", {
        totalAmount: {
            type: Sequelize.INTEGER,
            field: 'totalamount',
        },
        remaining: {
            type: Sequelize.INTEGER,
            field: 'remaining',
        }
    },
        {
            freezeTableName: true,

            timestamps: false,

            createdAt: false,

            updatedAt: false,
        });

    Stock.associate = function (models) {

        Stock.belongsTo(models.product,
            {
                foreignKey: 'productid',
            });
        Stock.belongsTo(models.branch,
            {
                foreignKey: 'branchid',
            });
    }

    return Stock;
};