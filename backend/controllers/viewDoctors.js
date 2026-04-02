const oracledb = require("oracledb");
const connectDB = require("../db/connection");

exports.getAllDoctors = async (req, res) => {
  let connection;
  try {
    connection = await connectDB();

    const result = await connection.execute(
      `SELECT 
         d.ID AS doctor_id,
         u.NAME AS doctor_name,
         d.DEGREES,
         d.EXPERIENCE_YEARS,
         s.NAME AS specialization
       FROM DOCTOR d
       JOIN USERS u ON d.USER_ID = u.ID
       LEFT JOIN DOC_SPECIALIZATION ds ON ds.DOCTOR_ID = d.ID
       LEFT JOIN SPECIALIZATION s ON s.ID = ds.SPECIALIZATION_ID
       ORDER BY u.NAME`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Group specialties per doctor
    const doctorsMap = {};
    for (let row of result.rows) {
      if (!doctorsMap[row.DOCTOR_ID]) {
        doctorsMap[row.DOCTOR_ID] = {
          id: row.DOCTOR_ID,
          name: row.DOCTOR_NAME,
          degrees: row.DEGREES,
          experience: row.EXPERIENCE_YEARS,
          specialties: [],
        };
      }
      if (row.SPECIALIZATION) doctorsMap[row.DOCTOR_ID].specialties.push(row.SPECIALIZATION);
    }

    res.json(Object.values(doctorsMap));
  } catch (err) {
    console.error("getAllDoctors error:", err);
    res.status(500).json({ error: "Failed to fetch doctors" });
  } finally {
    if (connection) await connection.close();
  }
};

exports.getAllSpecializations = async (req, res) => {
  let connection;
  try {
    connection = await connectDB();

    const result = await connection.execute(
      `SELECT ID, NAME FROM SPECIALIZATION ORDER BY NAME`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows.map(r => ({ id: r.ID, name: r.NAME })));
  } catch (err) {
    console.error("getAllSpecializations error:", err);
    res.status(500).json({ error: "Failed to fetch specializations" });
  } finally {
    if (connection) await connection.close();
  }
};

// viewDoctors.js
exports.getDoctorDetailsById = async (req, res) => {
  const { doctorId } = req.params;
  let connection;
  try {
    connection = await connectDB();
    const result = await connection.execute(
      `SELECT 
          d.ID,
          d.USER_ID,
          u.NAME,
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
       WHERE d.ID = :doctorId`,
      { doctorId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Doctor not found" });

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally {
    if (connection) await connection.close();
  }
};