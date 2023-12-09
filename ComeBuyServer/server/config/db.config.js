module.exports = {
  host: "db.airlvcqkdtovxsillafq.supabase.co",
  user: "postgres",
  password: "comebuydoantotnghiep",
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

///Production
// module.exports = {
//   host: "ec2-35-153-35-94.compute-1.amazonaws.com",
//   user: "ojzxtvwablxwnl",
//   password: "0fc0101f269f04db76448d1ff8ddf238a709cb7fc25298e0ce8d5b6ae7559518",
//   database: "d914vnfc67o3s2",
//   dialect: "postgres",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false, // <<<<<<< YOU NEED THIS TO FIX UNHANDLED REJECTION
//     },
//   },
// };

/// QAT
// module.exports = {
//   host: "ec2-34-199-68-114.compute-1.amazonaws.com",
//   user: "jnevosbegsddfg",
//   password: "7788c65e372cc6441444767217fe248720d3a1566c31540af90d07b76ed392b9",
//   database: "d2i0bf4if8cce8",
//   dialect: "postgres",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false, // <<<<<<< YOU NEED THIS TO FIX UNHANDLED REJECTION
//     },
//   },
// };
