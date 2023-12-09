const mongoose = require("mongoose");
const db = require("./models");

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false)
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database MongoDB connected successfully !");
  } catch (error) {
    console.log("Database Connection: ", error.message);
    process.exit(1);
  }
};

const connectDB_PostgresSQL = () => {
  db.sequelize.sync().then(() => {
    console.log("Database PostgresSQL connected successfully !");
  });
  //  Test database, model
  // db.sequelize.sync({ force: true }).then(() => {
  //   console.log("Drop and re-sync db.");
  //   console.log("Database connected successfully !");
  // });
};

module.exports = { connectDB, connectDB_PostgresSQL };
