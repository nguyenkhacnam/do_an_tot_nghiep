module.exports = (sequelize, Sequelize) => {
  const InvoiceItem = sequelize.define(
    "invoiceitem",
    {
      amount: {
        type: Sequelize.INTEGER,
        field: "amount",
        default: 1,
      },
      total: {
        type: Sequelize.INTEGER,
        field: "total",
        default: 1,
      },
    },
    {
      freezeTableName: true,

      timestamps: false,

      createdAt: false,

      updatedAt: false,
    }
  );
  InvoiceItem.associate = function (models) {
    InvoiceItem.belongsTo(models.invoice, {
      foreignKey: "invoiceid",
      as: "invoice",
    });

    InvoiceItem.belongsTo(models.product, {
      foreignKey: "productid",
    });
  };
  return InvoiceItem;
};
