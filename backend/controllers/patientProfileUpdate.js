const oracledb = require("oracledb");
const connectDB = require("../db/connection");

exports.createPatientProfile = async (req, res) => {
  const {
    userId,
    dateOfBirth,
    gender,
    occupation,
    bloodType,
    maritalStatus,
    address,
  } = req.body;

  
  if (!userId) {
    return res.status(400).json({
      error: "userId is required",
    });
  }

  let connection;

  try {
    connection = await connectDB();

    const sql = `
      INSERT INTO PATIENT
      (USER_ID, DATE_OF_BIRTH, GENDER, OCCUPATION, BLOOD_TYPE, MARITAL_STATUS, ADDRESS)
      VALUES
      (:userId, :dateOfBirth, :gender, :occupation, :bloodType, :maritalStatus, :address)
    `;

    const binds = {
      userId,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      gender: gender || null,
      occupation: occupation || null,
      bloodType: bloodType || null,
      maritalStatus: maritalStatus || null,
      address: address || null,
    };

    await connection.execute(sql, binds, { autoCommit: true });

    return res.status(201).json({
      message: "Patient profile created successfully",
    });
  } catch (error) {
    console.error("Error creating patient profile:", error);

    return res.status(500).json({
      error: "Failed to create patient profile",
      details: error.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Error closing connection:", closeError);
      }
    }
  }
};