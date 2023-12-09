module.exports = (sequelize, Sequelize) => {
  const Invoice = sequelize.define(
    "invoice",
    {
      invoiceID: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        field: "invoiceid",
      },
      date: {
        type: Sequelize.STRING,
        field: "date",
        default: 1,
      },
      // total: {
      //     type: Sequelize.STRING,
      //     field: 'total',
      //     default: 1
      // },
      moneyReceived: {
        type: Sequelize.STRING,
        field: "moneyreceived",
        default: 1,
      },
      isChecked: {
        type: Sequelize.BOOLEAN,
        field: "ischecked",
        default: false,
      },
      isPaid: {
        type: Sequelize.BOOLEAN,
        field: "ispaid",
        default: false,
      },
      address: {
        type: Sequelize.STRING(256),
        field: "address",
      },
      status: {
        type: Sequelize.STRING(256),
        field: "status",
        default: "pending",
      },
    },
    {
      freezeTableName: true,

      timestamps: false,

      createdAt: false,

      updatedAt: false,
    }
  );
  Invoice.associate = function (models) {
    Invoice.belongsTo(models.account, {
      foreignKey: "userid",
      as: "account",
      onDelete: "NO ACTION",
    });

    Invoice.belongsTo(models.branch, {
      foreignKey: "branchid",
      onDelete: "NO ACTION",
    });
    Invoice.hasMany(models.invoiceitem, {
      as: "invoiceitem",
      foreignKey: "invoiceid",
    });
  };
  return Invoice;
};
