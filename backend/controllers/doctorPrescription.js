const oracledb = require("oracledb");
const connectDB = require("../db/connection");

// Doctor creates NEW prescription (history preserved)
exports.createPrescription = async (req, res) => {
  const { appointmentId } = req.params;
  const {
    chiefComplaints,
    investigations,
    requiredTests,
    diagnosis,
    history,
    instructions,
    visitAgainAt, // string from input: "YYYY-MM-DD"
    medicines
  } = req.body;

  let connection;

  try {
    connection = await connectDB();

    // 1️⃣ Delete previous prescriptions for this appointment to prevent duplicates
    await connection.execute(
      `DELETE FROM FULL_PRESCRIPTION WHERE APPOINTMENT_ID = :appointmentId`,
      { appointmentId },
      { autoCommit: false }
    );

    // 2️⃣ Insert new prescriptions
    for (const med of medicines) {
      await connection.execute(
        `INSERT INTO FULL_PRESCRIPTION (
          APPOINTMENT_ID,
          DATE_ISSUED,
          CHIEF_COMPLAINTS,
          INVESTIGATIONS,
          REQUIRED_TESTS,
          DIAGNOSIS,
          HISTORY,
          INSTRUCTIONS,
          VISIT_AGAIN_AT,
          MEDICINE_NAME,
          DOSAGE,
          CONTINUE_DAYS
        )
        VALUES (
          :appointmentId,
          SYSDATE,
          :chiefComplaints,
          :investigations,
          :requiredTests,
          :diagnosis,
          :history,
          :instructions,
          TO_DATE(:visitAgainAt, 'YYYY-MM-DD'),
          :medicineName,
          :dosage,
          :days
        )`,
        {
          appointmentId,
          chiefComplaints,
          investigations,
          requiredTests,
          diagnosis,
          history,
          instructions,
          visitAgainAt, // convert string to DATE in Oracle
          medicineName: med.name,
          dosage: med.dosage,
          days: med.days
        },
        { autoCommit: false }
      );
    }

    await connection.commit();
    res.json({ message: "✅ Prescription saved and previous data cleared" });

  } catch (err) {
    console.error(err);
    if (connection) await connection.rollback();
    res.status(500).json({ error: "Server error", details: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

// Doctor views prescription for an appointment
// doctorPrescription.js
exports.getPrescription = async (req, res) => {
  const { appointmentId } = req.params;
  let connection;
  try {
    connection = await connectDB();

    // fetch appointment status
    const statusResult = await connection.execute(
      `SELECT STATUS FROM DOCTORS_APPOINTMENTS WHERE ID = :id`,
      { id: appointmentId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const status = statusResult.rows[0]?.STATUS;
    if (!status) return res.status(404).json({ error: "Appointment not found" });
    if (status !== "COMPLETED") {
      return res.status(403).json({ error: "Prescription can only be viewed after appointment completion" });
    }

    // fetch prescription
    const result = await connection.execute(
      `SELECT * FROM FULL_PRESCRIPTION WHERE APPOINTMENT_ID = :appointmentId`,
      { appointmentId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  } finally {
    if (connection) await connection.close();
  }
};

// Add this to your doctorPrescription controller file
exports.getDoctorHistory = async (req, res) => {
  const { doctorId } = req.params;
  let connection;
  
  try {
    connection = await connectDB();

    const sql = `
      SELECT 
        a.ID AS APPOINTMENT_ID, 
        u.NAME AS PATIENT_NAME, 
        p.GENDER, 
        p.BLOOD_TYPE, 
        TO_CHAR(a.APPOINTMENT_DATE, 'YYYY-MM-DD') AS APPOINTMENT_DATE, 
        t.START_TIME, 
        t.END_TIME 
      FROM DOCTORS_APPOINTMENTS a
      JOIN TIME_SLOTS t ON a.TIME_SLOT_ID = t.ID
      JOIN PATIENT p ON a.PATIENT_ID = p.ID
      JOIN USERS u ON p.USER_ID = u.ID
      WHERE a.DOCTOR_ID = :doctorId 
        AND UPPER(a.STATUS) = 'COMPLETED'
      ORDER BY a.APPOINTMENT_DATE DESC`;

    const result = await connection.execute(
      sql,
      { doctorId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);

  } catch (err) {
    console.error("History Fetch Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  } finally {
    if (connection) await connection.close();
  }
};