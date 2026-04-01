const oracledb = require("oracledb");
const connectDB = require("../db/connection");

exports.getDoctorProfile = async (req, res) => {
  const { email } = req.params;
  let connection;

  try {
    connection = await connectDB();

// ... existing code
    const result = await connection.execute(
      `SELECT 
          d.ID,
          d.USER_ID,
          u.NAME,            -- Added this line
          u.EMAIL,
          d.LICENSE_NUMBER,
          d.DEGREES,
          d.EXPERIENCE_YEARS,
          d.DEPT_ID,
          d.BRANCH_ID,
          s.NAME AS SPECIALIZATION
       FROM DOCTOR d
       JOIN USERS u ON d.USER_ID = u.ID
       LEFT JOIN DOC_SPECIALIZATION ds ON ds.DOCTOR_ID = d.ID
       LEFT JOIN SPECIALIZATION s ON s.ID = ds.SPECIALIZATION_ID
       WHERE TRIM(LOWER(u.EMAIL)) = TRIM(LOWER(:email))
         AND TRIM(UPPER(u.ROLE)) = 'DOCTOR'`,
      { email },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Doctor profile not found" });
    }

    const row = result.rows[0];

    res.status(200).json({
      id: row.ID,
      userId: row.USER_ID,
      name: row.NAME,       // Added this line
      email: row.EMAIL,
      licenseNumber: row.LICENSE_NUMBER,
      degrees: row.DEGREES,
      experienceYears: row.EXPERIENCE_YEARS,
      deptId: row.DEPT_ID,
      branchId: row.BRANCH_ID,
      specialization: row.SPECIALIZATION || "Not provided",
    });
// ... rest of the code

  } catch (err) {
    console.error("getDoctorProfile error:", err);
    res.status(500).json({ error: "Server error" });
  } finally {
    if (connection) await connection.close();
  }
};