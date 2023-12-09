module.exports = (sequelize, Sequelize) => {
    const Cart = sequelize.define("cart", {
        cartID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            field: 'cartid',
        },
        amount: {
            type: Sequelize.INTEGER,
            field: 'amount',
            default: 1
        },
    },
        {
            freezeTableName: true,

            timestamps: false,

            createdAt: false,

            updatedAt: false,
        });
    Cart.associate = function (models) {
        Cart.belongsTo(models.account,
            {
                foreignKey: 'userid',
                as :"account"
                // onDelete: 'SET NULL',
            });

        Cart.belongsTo(models.product,
            {
                foreignKey: 'productid',
                // onDelete: 'SET NULL',
            });
    }
    return Cart;
};