module.exports = (sequelize, Sequelize) => {
    const ProductImage = sequelize.define("productimage", {
        productImageID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            field: 'productimageid',
        },
        // productID: {
        //     type: Sequelize.UUID,
        //     defaultValue: Sequelize.UUIDV4,
        //     field: 'productid',
        // },
        imageURL: {
            type: Sequelize.STRING(512),
            field: 'imageurl'
        },
    },
    {
        freezeTableName: true,
  
        timestamps: false,
  
        createdAt: false,
  
        updatedAt: false,
      });

    ProductImage.associate = function (models) {

        ProductImage.belongsTo(models.product,
            {
                foreignKey: 'productid',
                as :"product"
                // onDelete: 'SET NULL',
            });

    }

    return ProductImage;
};