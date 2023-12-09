module.exports = (sequelize, Sequelize) => {
  const Log = sequelize.define("log", {
    logID: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      field: "logid",
    },
    userID: {
      type: Sequelize.UUID,
      field: "userid",
    },
    role: {
      type: Sequelize.STRING,
      field: "role",
    },
    action: {
      type: Sequelize.STRING(256),
      field: "action",
    },
  });
  return Log;
};
