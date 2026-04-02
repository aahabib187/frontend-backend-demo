const connectDB = require("../db/connection");
const oracledb = require("oracledb");

const getDayName = (dateString) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const date = new Date(dateString);
  return days[date.getDay()];
};

exports.getAvailableSlots = async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: "❌ Date is required" });
  }

  const dayOfWeek = getDayName(date);

  let connection;
  try {
    connection = await connectDB();

    const slotResult = await connection.execute(
      `SELECT ID, START_TIME, END_TIME, DAY_OF_WEEK
       FROM TIME_SLOTS
       WHERE DOCTOR_ID = :doctorId
         AND DAY_OF_WEEK = :dayOfWeek
         AND STATUS = 'AVAILABLE'
       ORDER BY START_TIME`,
      { doctorId, dayOfWeek }
    );

    const bookedResult = await connection.execute(
      `SELECT TIME_SLOT_ID
       FROM DOCTORS_APPOINTMENTS
       WHERE DOCTOR_ID = :doctorId
         AND APPOINTMENT_DATE = TO_DATE(:dateStr, 'YYYY-MM-DD')
         AND STATUS = 'BOOKED'`,
      { doctorId, dateStr: date }
    );

    const bookedIds = new Set(bookedResult.rows.map(row => row[0]));

    const availableSlots = slotResult.rows
      .map(row => ({
        timeSlotId: row[0],
        startTime: row[1],
        endTime: row[2],
        dayOfWeek: row[3]
      }))
      .filter(slot => !bookedIds.has(slot.timeSlotId));

    return res.status(200).json({ slots: availableSlots });
  } catch (err) {
    console.error("Get available slots error:", err);
    return res.status(500).json({ error: "❌ Failed to get available slots" });
  } finally {
    if (connection) await connection.close();
  }
};

exports.bookAppointment = async (req, res) => {
  const { patientEmail, doctorId, appointmentDate, timeSlotId, type } = req.body;

  if (!patientEmail || !doctorId || !appointmentDate || !timeSlotId) {
    return res.status(400).json({ error: "❌ Missing required fields" });
  }

  let connection;
  try {
    connection = await connectDB();

    const userResult = await connection.execute(
      `SELECT ID
       FROM USERS
       WHERE TRIM(LOWER(EMAIL)) = TRIM(LOWER(:email))
         AND TRIM(UPPER(ROLE)) = 'PATIENT'`,
      { email: patientEmail }
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "❌ Patient user not found" });
    }

    const userId = userResult.rows[0][0];

    const patientResult = await connection.execute(
      `SELECT ID FROM PATIENT WHERE USER_ID = :userId`,
      { userId }
    );

    if (patientResult.rows.length === 0) {
      return res.status(404).json({ error: "❌ Patient profile not found" });
    }

    const patientId = patientResult.rows[0][0];

    const slotResult = await connection.execute(
      `SELECT ID, DOCTOR_ID, STATUS
       FROM TIME_SLOTS
       WHERE ID = :timeSlotId
         AND DOCTOR_ID = :doctorId
         AND STATUS = 'AVAILABLE'`,
      { timeSlotId, doctorId }
    );

    if (slotResult.rows.length === 0) {
      return res.status(404).json({ error: "❌ Selected time slot not found for this doctor" });
    }

    const existingResult = await connection.execute(
      `SELECT ID
       FROM DOCTORS_APPOINTMENTS
       WHERE DOCTOR_ID = :doctorId
         AND APPOINTMENT_DATE = TO_DATE(:appointmentDate, 'YYYY-MM-DD')
         AND TIME_SLOT_ID = :timeSlotId
         AND STATUS = 'BOOKED'`,
      { doctorId, appointmentDate, timeSlotId }
    );

    if (existingResult.rows.length > 0) {
      return res.status(409).json({ error: "❌ This slot is already booked" });
    }

    await connection.execute(
      `INSERT INTO DOCTORS_APPOINTMENTS
        (PATIENT_ID, DOCTOR_ID, APPOINTMENT_DATE, TIME_SLOT_ID, STATUS, TYPE)
       VALUES
        (:patientId, :doctorId, TO_DATE(:appointmentDate, 'YYYY-MM-DD'), :timeSlotId, :status, :type)`,
      {
        patientId,
        doctorId,
        appointmentDate,
        timeSlotId,
        status: "BOOKED",
        type: type || "General"
      }
    );
    // Update the time slot status to BOOKED
await connection.execute(
  `UPDATE TIME_SLOTS
     SET STATUS = 'BOOKED',
         LAST_EDITED_AT = SYSDATE
   WHERE ID = :timeSlotId
     AND DOCTOR_ID = :doctorId`,
  { timeSlotId, doctorId }
);

    await connection.commit();

    return res.status(201).json({
      message: "✅ Appointment booked successfully"
    });
  } catch (err) {
    console.error("Book appointment error:", err);

    if (connection) {
      try {
        await connection.rollback();
      } catch (_) {}
    }

    return res.status(500).json({ error: "❌ Failed to book appointment" });
  } finally {
    if (connection) await connection.close();
  }
};

//Afnan . To see upcoming Appointments
// Afnan . Updated to find the correct PATIENT_ID
exports.getUpcomingAppointments = async (req, res) => {
  const { patientEmail } = req.query;
  if (!patientEmail) return res.status(400).json({ error: "❌ Patient email required" });

  let connection;
  try {
    connection = await connectDB();

    // 1. Get the USER ID first
    const userResult = await connection.execute(
      `SELECT ID FROM USERS 
       WHERE TRIM(LOWER(EMAIL)) = TRIM(LOWER(:email)) 
       AND TRIM(UPPER(ROLE)) = 'PATIENT'`,
      { email: patientEmail }
    );

    if (userResult.rows.length === 0)
      return res.status(404).json({ error: "❌ Patient user not found" });

    const userId = userResult.rows[0][0];

    // 2. IMPORTANT: Get the ID from the PATIENT table using the USER_ID
    const patientResult = await connection.execute(
      `SELECT ID FROM PATIENT WHERE USER_ID = :userId`,
      { userId }
    );

    if (patientResult.rows.length === 0)
      return res.status(404).json({ error: "❌ Patient profile not found" });

    const actualPatientId = patientResult.rows[0][0]; // This is the ID used in DOCTORS_APPOINTMENTS

    // 3. Fetch upcoming appointments using actualPatientId
    const result = await connection.execute(
      `SELECT 
         a.ID AS APPOINTMENT_ID,
         a.APPOINTMENT_DATE,
         ts.START_TIME,
         ts.END_TIME,
         u.NAME AS DOCTOR_NAME,
         d.DEGREES,
         s.NAME AS SPECIALIZATION
       FROM DOCTORS_APPOINTMENTS a
       JOIN DOCTOR d ON a.DOCTOR_ID = d.ID
       JOIN USERS u ON d.USER_ID = u.ID
       LEFT JOIN DOC_SPECIALIZATION ds ON ds.DOCTOR_ID = d.ID
       LEFT JOIN SPECIALIZATION s ON s.ID = ds.SPECIALIZATION_ID
       JOIN TIME_SLOTS ts ON ts.ID = a.TIME_SLOT_ID
       WHERE a.PATIENT_ID = :patientId -- Now matches the ID in the table
         AND TRIM(UPPER(a.STATUS)) = 'BOOKED'
       ORDER BY a.APPOINTMENT_DATE, ts.START_TIME`,
      { patientId: actualPatientId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Get upcoming appointments error:", err);
    return res.status(500).json({ error: "❌ Failed to fetch upcoming appointments" });
  } finally {
    if (connection) await connection.close();
  }
};

//Afnan
