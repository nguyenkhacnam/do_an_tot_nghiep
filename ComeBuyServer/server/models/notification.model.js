module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define("notification", {
        notiID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            field: 'notiid',
        },
        userID: {
            type: Sequelize.UUID,
            field: 'userid',
        },
        body: {
            type: Sequelize.STRING,
            field: 'body',
        },
        isSeen: {
            type: Sequelize.BOOLEAN,
            field: 'isseen',
            default: false
        },
    },
    {
        freezeTableName: true,
  
        timestamps: false,
  
        createdAt: false,
  
        updatedAt: false,
      });
    Notification.associate = function (models) {
        Notification.belongsTo(models.account,
            {
                foreignKey: 'userid',
                // onDelete: 'SET NULL',
            });
    }
    return Notification;
};