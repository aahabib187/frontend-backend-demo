console.log("authController.js file loaded!");
const bcrypt = require("bcrypt");
const connectDB = require("../db/connection");

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (pass) => {
  return pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass);
};

exports.signup = async (req, res) => {
  const { name, email, pass, phone, role } = req.body;
  console.log("📨 Signup request received:", { name, email, phone, role });

  if (!name || !email || !pass || !phone || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!validatePassword(pass)) {
    return res.status(400).json({ 
      error: "Password must be at least 8 characters with uppercase and number" 
    });
  }

  if (!/^\d{11}$/.test(phone)) {
    return res.status(400).json({ error: "Phone must be 11 digits" });
  }

  const validRoles = ["user", "admin", "patient","doctor","staff"];
  if (!validRoles.includes(role.toLowerCase())) {
    return res.status(400).json({ error: "Invalid role" });
  }


  let connection;
  try {
    

     connection = await connectDB();
    console.log(" Connected to database");

    const duplicateCheck = await connection.execute(
      `SELECT NAME, EMAIL FROM USERS WHERE NAME = :name AND EMAIL = :email`,
      { name, email }
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({ 
        error: "User with this name and email already exists" 
      });
    }

   // hash password
    const hashedPassword = await bcrypt.hash(pass, 10);
    console.log("🔐 Password hashed successfully");

    // insert user into Oracle
    await connection.execute(
      `INSERT INTO USERS (NAME, EMAIL, PASS, PHONE, ROLE)
       VALUES (:name, :email, :pass, :phone, :role)`,
      { name, email, pass: hashedPassword, phone, role },
      { autoCommit: true }
    );
    console.log("User created successfully in database:", email);
    res.status(201).json({ message: "User created successfully",user: { name, email, phone, role } });

    

  } catch (err) {
    console.error("Signup error:", err);
    if (err.message.includes("UNIQUE constraint") || err.message.includes("ORA-00001")) {
      return res.status(409).json({ 
        error: "User with this name and email combination already exists" 
      });
    }
    res.status(500).json({ error: "Signup failed. Please try again." });
  }finally{
    if(connection)
    {
      await connection.close();
      console.log("Database connection closed");
    }
  }
};