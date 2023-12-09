const app = require('./app');
const { connectDB } = require('./database');
const { connectDB_PostgresSQL } = require('./database');
require('dotenv').config();
const port = process.env.PORT || 5000;

//Connect database
connectDB_PostgresSQL();
connectDB();

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message, err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});

