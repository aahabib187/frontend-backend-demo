console.log("login.js file loaded!");
const bcrypt = require("bcrypt");
const connectDB = require("../db/connection");

exports.login = async (req, res) => {
  const { email, pass } = req.body;
  console.log("📨 Login request received:", { email });

  let connection;

  try {
    connection = await connectDB();
    console.log("🔗 Connected to database");

    // Find user by email
    const result = await connection.execute(
      `SELECT NAME, EMAIL, PASS, ROLE FROM USERS WHERE EMAIL = :email`,
      { email }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];
    const dbUser = {
      name: user[0],
      email: user[1],
      hashedPassword: user[2],
      role: user[3],
    };

    // Compare password
    const isMatch = await bcrypt.compare(pass, dbUser.hashedPassword);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
      },
    });

  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) {
      await connection.close();
      console.log("🔌 Database connection closed");
    }
  }
};
// module.exports={login};