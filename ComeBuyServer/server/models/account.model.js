module.exports = (sequelize, Sequelize) => {
  const Account = sequelize.define("account", {
    userID: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      field: 'userid',

    },
    phoneNumber: {
      type: Sequelize.STRING,
      field: 'phonenumber'
    },
    name: {
      type: Sequelize.STRING,
      field: "name"
    },
    dob: {
      type: Sequelize.STRING,
      field: "dob"
    },
    avatar: {
      type: Sequelize.STRING,
      field: "avatar"
    },
    email: {
      type: Sequelize.STRING,
      field: "email"
    },
    password: {
      type: Sequelize.STRING,
      field: "password"
    },
    address: {
      type: Sequelize.STRING,
      field: "address"
    },
    role: {
      type: Sequelize.STRING,
      field: "role"
    },
    sex: {
      type: Sequelize.STRING,
      field: "sex"
    },
    bio: {
      type: Sequelize.STRING,
      field: "bio"
    },
    score: {
      type: Sequelize.INTEGER,
      field: "score",
      default: 0
    },

  },
    {
      freezeTableName: true,

      timestamps: false,

      createdAt: false,

      updatedAt: false,
    });


  Account.associate = function (models) {
    Account.hasMany(models.notification, {
      as: "notification",
      foreignKey: "userid",
    });
    Account.hasMany(models.invoice, {
      as: "invoice",
      foreignKey: "userid",
    });
    Account.hasMany(models.comment, {
      as: "comment",
      foreignKey: "userid",
    });
    Account.hasMany(models.cart, {
      as: "cart",
      foreignKey: "userid",
    });
    Account.hasMany(models.favorite, {
      as: "favorite",
      foreignKey: "userid",
    });
    Account.hasOne(models.branch, { foreignKey: 'userid' });
  }
  return Account;
};