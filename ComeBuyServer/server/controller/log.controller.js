const db = require("../models");
const Log = db.log;
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const SendResponse = require("../utils/SendResponse");
const { Op, QueryTypes } = require("sequelize");
const { sequelize } = require("../models");

exports.findById = catchAsync(async (req, res, next) => {
  let data;
  let query = `
  select *, count(*) over () as total from logs
  where "createdAt" > now() - INTERVAL '3 months'
  `;
  if (req.params.userID.trim() !== "admin") {
    query += ` and userid = '${req.params.userID}' `;
  }
  query += `group by logid order by "createdAt" desc offset ${
    (req.params.offset - 1) * 5
  } limit 5`;
  data = await sequelize.query(query, { type: QueryTypes.SELECT });
  if (data) {
    SendResponse(data, 200, res);
  } else {
    next(new AppError("Some error occurred while retrieving log.", 500));
  }
});
