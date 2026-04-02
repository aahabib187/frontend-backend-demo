const oracledb = require("oracledb");
const connectDB = require("../db/connection");

exports.saveDoctorTimeSlots = async (req, res) => {
  const { email, timeSlots } = req.body;

  // ✅ Validate
  if (!email || !Array.isArray(timeSlots) || timeSlots.length === 0) {
    return res.status(400).json({ error: "❌ Email and timeSlots array are required" });
  }

  let connection;

  try {
    connection = await connectDB();

    // 1️⃣ Get doctor ID by email
    const doctorResult = await connection.execute(
      `SELECT d.ID AS doctor_id
       FROM DOCTOR d
       JOIN USERS u ON d.USER_ID = u.ID
       WHERE TRIM(LOWER(u.EMAIL)) = TRIM(LOWER(:email))`,
      { email },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (doctorResult.rows.length === 0) {
      return res.status(404).json({ error: "❌ Doctor not found" });
    }

    const doctorId = doctorResult.rows[0].DOCTOR_ID;

// 2️⃣ Delete only AVAILABLE (unbooked) time slots for this doctor
await connection.execute(
  `DELETE FROM TIME_SLOTS 
   WHERE DOCTOR_ID = :doctorId 
   AND ID NOT IN (SELECT TIME_SLOT_ID FROM DOCTORS_APPOINTMENTS)`, 
  { doctorId }
);

    // 3️⃣ Insert new time slots & generate chunks
    const uniqueSlots = new Set();

    // helper functions
    const toMinutes = (timeStr) => {
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    const toTimeStr = (minutes) => {
      const h = Math.floor(minutes / 60).toString().padStart(2, "0");
      const m = (minutes % 60).toString().padStart(2, "0");
      return `${h}:${m}`;
    };

    for (const slot of timeSlots) {
      const { dayOfWeek, startTime, endTime, interval } = slot;
      if (!dayOfWeek || !startTime || !endTime || !interval) continue;

      // 🔑 unique key (matches DB constraint)
      const key = `${doctorId}_${dayOfWeek}_${startTime}`;
      if (uniqueSlots.has(key)) continue;
      uniqueSlots.add(key);

      const startMin = toMinutes(startTime);
      const endMin = toMinutes(endTime);
      const chunkLength = parseInt(interval, 10);

      for (let t = startMin; t < endMin; t += chunkLength) {
        const chunkStart = toTimeStr(t);
        const chunkEnd = toTimeStr(Math.min(t + chunkLength, endMin));

        // 4️⃣ Insert chunk into TIME_SLOTS
        const result = await connection.execute(
          `INSERT INTO TIME_SLOTS 
             (DOCTOR_ID, DAY_OF_WEEK, START_TIME, END_TIME, CREATED_AT)
           VALUES
             (:doctorId, :dayOfWeek, :startTime, :endTime, SYSDATE)
           RETURNING ID INTO :slotId`,
          {
            doctorId,
            dayOfWeek,
            startTime: chunkStart,
            endTime: chunkEnd,
            slotId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
          }
        );

        const timeSlotId = result.outBinds.slotId[0];

        // 5️⃣ Insert corresponding entry into DOCTORS_APPOINTMENTS
        await connection.execute(
          `INSERT INTO DOCTORS_APPOINTMENTS
             (DOCTOR_ID, TIME_SLOT_ID, APPOINTMENT_DATE, STATUS, TYPE)
           VALUES
             (:doctorId, :slotId, NULL, 'AVAILABLE', :type)`,
          { doctorId, slotId: timeSlotId, type: "GENERAL" }
        );
      }
    }

    await connection.commit();
    res.status(200).json({ message: "✅ Time slots and appointment chunks saved successfully" });

  } catch (err) {
    console.error("Error saving doctor time slots:", err);
    if (connection) {
      try { await connection.rollback(); } catch (_) {}
    }
    res.status(500).json({ error: "❌ Server error" });

  } finally {
    if (connection) {
      try { await connection.close(); } catch (_) {}
    }
  }
};