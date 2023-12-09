module.exports = (sequelize, Sequelize) => {
    const Favorite = sequelize.define("favorite", {
        favoriteID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            field: 'favoriteid',
        },
    },
        {
            freezeTableName: true,

            timestamps: false,

            createdAt: false,

            updatedAt: false,
        });
        Favorite.associate = function (models) {
        Favorite.belongsTo(models.account,
            {
                foreignKey: 'userid',
                as :"account"
                // onDelete: 'SET NULL',
            });

            Favorite.belongsTo(models.product,
            {
                foreignKey: 'productid',
                // onDelete: 'SET NULL',
            });
    }
    return Favorite;
};