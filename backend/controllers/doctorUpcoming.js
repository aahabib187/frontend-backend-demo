const oracledb = require("oracledb");
const connectDB = require("../db/connection");
exports.getDoctorSchedule = async (req, res) => {
  const { doctorId } = req.params; // 1. Get from URL

  // 2. SAFETY CHECK: Convert to a real number
  const idToUse = parseInt(doctorId, 10);

  if (isNaN(idToUse)) {
    console.error("❌ ORA-01722 Prevention: doctorId is not a number:", doctorId);
    return res.status(400).json({ error: "Invalid Doctor ID format" });
  }

  let connection;
  try {
    connection = await connectDB();

        // 🔹 Auto-cancel past appointments
    await connection.execute(
      `UPDATE DOCTORS_APPOINTMENTS
       SET STATUS = 'CANCELED'
       WHERE DOCTOR_ID = :doctorId
         AND STATUS = 'BOOKED'
         AND APPOINTMENT_DATE < SYSDATE`,
      { doctorId: idToUse },
      { autoCommit: true }
    );

    // 🔹 Fetch upcoming appointments
    const result = await connection.execute(
      `SELECT 
         a.ID AS APPOINTMENT_ID,
         a.APPOINTMENT_DATE,
         ts.START_TIME,
         ts.END_TIME,
         u.NAME AS PATIENT_NAME,
         p.GENDER,
         p.BLOOD_TYPE
       FROM DOCTORS_APPOINTMENTS a
       JOIN PATIENT p ON a.PATIENT_ID = p.ID
       JOIN USERS u ON p.USER_ID = u.ID
       JOIN TIME_SLOTS ts ON ts.ID = a.TIME_SLOT_ID
       WHERE a.DOCTOR_ID = :doctorId
         AND a.STATUS = 'BOOKED'
       ORDER BY a.APPOINTMENT_DATE, ts.START_TIME`,
      { doctorId: idToUse }, // 3. Use the numeric variable here
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log("Rows returned for doctor:", idToUse, result.rows.length);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Doctor schedule error:", err);
    return res.status(500).json({ error: "❌ Failed to fetch schedule" });
  } finally {
    if (connection) await connection.close();
  }
};

exports.markAppointmentDone = async (req, res) => {
  const { appointmentId } = req.params;

  const idToUse = parseInt(appointmentId, 10);
  if (isNaN(idToUse)) {
    return res.status(400).json({ error: "Invalid appointment ID" });
  }

  let connection;
  try {
    connection = await connectDB();

    await connection.execute(
      `UPDATE DOCTORS_APPOINTMENTS
       SET STATUS = 'COMPLETED'
       WHERE ID = :id`,
      { id: idToUse },
      { autoCommit: true }
    );

    return res.status(200).json({
      message: "✅ Appointment marked as completed",
    });

  } catch (err) {
    console.error("Mark done error:", err);
    return res.status(500).json({ error: "Failed to update appointment" });
  } finally {
    if (connection) await connection.close();
  }
};

