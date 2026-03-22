const oracledb = require("oracledb");

const dbConfig = {
  user: "system",
  password: "Afnan@123",
  connectString: "localhost/orclpdb"
};

async function connectDB() {
  return await oracledb.getConnection(dbConfig);
}

module.exports = connectDB;