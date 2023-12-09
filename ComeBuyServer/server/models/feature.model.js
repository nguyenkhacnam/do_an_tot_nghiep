module.exports = (sequelize, Sequelize) => {
    const Feature = sequelize.define("feature", {
        featureID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            field: 'featureid',
        },
        name: {
            type: Sequelize.STRING,
            field: 'name',
        },
       
    },
    {
        freezeTableName: true,
  
        timestamps: false,
  
        createdAt: false,
  
        updatedAt: false,
      });
    Feature.associate = function (models) {
        Feature.belongsToMany(models.product, {
            through: "product_feature",
            as: "product",
            foreignKey: "featureid",
          });
    }
    return Feature;
};