const db = require("../models");
const Log = db.log;

const SaveLog = async (data) => {
  const { action, userID, role } = data;
  const response = await Log.create({
    role: role,
    userID: userID,
    action: action,
  });
  if (response) console.log("Save Log successfully " + action);
  else console.log("Save Log failed " + action);
};

module.exports = SaveLog;
