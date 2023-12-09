module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define(
    "comment",
    {
      commentID: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        field: "commentid",
      },
      postDate: {
        type: Sequelize.STRING,
        field: "postdate",
      },
      body: {
        type: Sequelize.STRING(512),
        field: "body",
      },
      status: {
        type: Sequelize.INTEGER,
        field: "status",
        defaultValue: 0,
      },
    },
    {
      freezeTableName: true,

      timestamps: false,

      createdAt: false,

      updatedAt: false,
    }
  );

  Comment.associate = function (models) {
    Comment.belongsTo(models.product, {
      foreignKey: "productid",
      // onDelete: 'SET NULL',
    });
    Comment.belongsTo(models.account, {
      foreignKey: "userid",
      // onDelete: 'SET NULL',
    });
    // Comment.belongsTo(models.comment,
    // {
    //     foreignKey: 'commentid',
    //     // onDelete: 'SET NULL',
    // });
    // Comment.hasOne(models.comment);
  };

  return Comment;
};
