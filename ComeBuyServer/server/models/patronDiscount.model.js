module.exports = (sequelize, Sequelize) => {
    const patronDiscount = sequelize.define("patrondiscount", {
        memberShipID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            field: 'membershipid',
        },
        base: {
            type: Sequelize.INTEGER,
            field: 'base',
            default: 1000000
        },
        memberShipRank: {
            type: Sequelize.STRING(100),
            field: 'membershiprank'
        },
        percentDiscount: {
            type: Sequelize.INTEGER,
            field: 'percentdiscount',
            default: 0
        },
    },
    {
        freezeTableName: true,
  
        timestamps: false,
  
        createdAt: false,
  
        updatedAt: false,
      });

    return patronDiscount;
};