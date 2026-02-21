const bcrypt = require("bcrypt");
const connectDB = require("../db/connection");

exports.signup = async (req, res) => {
  const { name, email, pass, phone, role } = req.body;

  try {
    // hash password
    const hashedPassword = await bcrypt.hash(pass, 10);

    const connection = await connectDB();

    // insert user into Oracle
    await connection.execute(
      `INSERT INTO USERS (NAME, EMAIL, PASS, PHONE, ROLE)
       VALUES (:name, :email, :pass, :phone, :role)`,
      { name, email, pass: hashedPassword, phone, role },
      { autoCommit: true }
    );

    res.status(201).json({ message: "User created successfully" });

    await connection.close();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};