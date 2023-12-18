module.exports = {
  host: "db.airlvcqkdtovxsillafq.supabase.co",
  user: "postgres",
  password: "WfjxyorMxgKLRXIm",
  database: "postgres",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // <<<<<<< YOU NEED THIS TO FIX UNHANDLED REJECTION
    },
  },
};

// module.exports = {
//   host: "localhost",
//   user: "postgres",
//   password: "123456",
//   database: "comebuy",
//   dialect: "postgres",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
//   dialectOptions: {
//     ssl: {
//       require: false,
//       rejectUnauthorized: false, // <<<<<<< YOU NEED THIS TO FIX UNHANDLED REJECTION
//     },
//   },
// };

