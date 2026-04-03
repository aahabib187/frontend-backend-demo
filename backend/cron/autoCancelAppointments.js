const cron = require("node-cron");
const connectDB = require("../db/connection");

const autoCancelPastAppointments = async () => {
  let connection;
  try {
    connection = await connectDB();

    const result = await connection.execute(
      `UPDATE DOCTORS_APPOINTMENTS
       SET STATUS = 'CANCELED'
       WHERE STATUS = 'BOOKED'
         AND APPOINTMENT_DATE < SYSDATE`,
      {},
      { autoCommit: true }
    );

    console.log("✅ Auto-canceled past appointments:", result.rowsAffected);

  } catch (err) {
    console.error("❌ Error in auto-cancel cron:", err);
  } finally {
    if (connection) await connection.close();
  }
};

// ── Schedule: run every day at 00:00 (midnight) ──
cron.schedule("0 0 * * *", () => {
  console.log("⏰ Running auto-cancel cron job...");
  autoCancelPastAppointments();
});