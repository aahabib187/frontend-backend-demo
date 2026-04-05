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
      error: "❌ userId is required",
    });
  }

  let connection;

  try {
    connection = await connectDB();


    const sql = `
      MERGE INTO PATIENT p
  USING (SELECT :userId AS user_id FROM DUAL) src
  ON (p.USER_ID = src.user_id)
  WHEN MATCHED THEN
    UPDATE SET 
      DATE_OF_BIRTH = :dateOfBirth,
      GENDER = :gender,
      OCCUPATION = :occupation,
      BLOOD_TYPE = :bloodType,
      MARITAL_STATUS = :maritalStatus,
      ADDRESS = :address
  WHEN NOT MATCHED THEN
      INSERT
      (USER_ID, DATE_OF_BIRTH, GENDER, OCCUPATION, BLOOD_TYPE, MARITAL_STATUS, ADDRESS)
      VALUES
      (:userId, :dateOfBirth, :gender, :occupation, :bloodType, :maritalStatus, :address)
    `;


    const binds = {
      userId: Number(userId),
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      gender: gender || null,
      occupation: occupation || null,
      bloodType: bloodType || null,
      maritalStatus: maritalStatus || null,
      address: address || null,
    };

    await connection.execute(sql, binds, { autoCommit: true });
 //return the userId so frontend can use it
return res.status(201).json({
  message: "Patient profile created successfully",
  user: {
    id: userId,       // <-- add this
  },
});
   
  } catch (error) {
    console.error("Error creating patient profile:", error);

    return res.status(500).json({
      error: "❌ Failed to create patient profile",
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

// --- NEW GET FUNCTION FOR THE DASHBOARD --- Afnan
exports.getPatientProfile = async (req, res) => {
  const { email } = req.params; // This matches your /profile/:email route
  let connection;

  try {
    connection = await connectDB();

    // Joining USERS and PATIENT tables to get all info
    const sql = `
      SELECT u.ID AS USER_ID, p.ID AS PATIENT_ID, u.NAME, u.EMAIL, 
             p.DATE_OF_BIRTH, p.GENDER, p.OCCUPATION, p.BLOOD_TYPE, 
             p.MARITAL_STATUS, p.ADDRESS
      FROM USERS u
      JOIN PATIENT p ON u.ID = p.USER_ID
      WHERE UPPER(u.EMAIL) = UPPER(:email)
    `;

    const result = await connection.execute(sql, { email }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Patient profile not found" });
    }

    // Send the first row back to the frontend
    const profile = result.rows[0];
    res.json({
       id: profile.PATIENT_ID, // <--- THIS IS THE KEY PIECE
      name: profile.NAME,
      email: profile.EMAIL,
      dateOfBirth: profile.DATE_OF_BIRTH ? profile.DATE_OF_BIRTH.toISOString().split('T')[0] : "N/A",
      gender: profile.GENDER,
      occupation: profile.OCCUPATION,
      bloodType: profile.BLOOD_TYPE,
      maritalStatus: profile.MARITAL_STATUS,
      address: profile.ADDRESS
    });

  } catch (error) {
    console.error("Error fetching patient profile:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) await connection.close();
  }};

  //Afnan