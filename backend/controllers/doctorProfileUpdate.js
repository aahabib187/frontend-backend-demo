const connectDB = require("../db/connection");

exports.updateDoctorProfile = async (req, res) => {
  const {
    email,
    licenseNumber,
    degrees,
    experienceYears,
    deptId,
    branchId,
  } = req.body;

  let connection;

  if (
    !email ||
    !licenseNumber ||
    !degrees ||
    experienceYears === undefined ||
    deptId === undefined ||
    branchId === undefined
  ) {
    return res.status(400).json({
      error: "email, licenseNumber, degrees, experienceYears, deptId, and branchId are required",
    });
  }

  try {
    connection = await connectDB();

    const result = await connection.execute(
      `SELECT d.ID
       FROM DOCTOR d
       JOIN USERS u
         ON d.USER_ID = u.ID
       WHERE TRIM(LOWER(u.EMAIL)) = TRIM(LOWER(:email))
         AND TRIM(UPPER(u.ROLE)) = 'DOCTOR'`,
      { email }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Doctor profile not found for this email",
      });
    }

    const doctorId = result.rows[0][0];

    await connection.execute(
      `UPDATE DOCTOR
       SET LICENSE_NUMBER = :licenseNumber,
           DEGREES = :degrees,
           EXPERIENCE_YEARS = :experienceYears,
           DEPT_ID = :deptId,
           BRANCH_ID = :branchId
       WHERE ID = :doctorId`,
      {
        licenseNumber,
        degrees,
        experienceYears,
        deptId,
        branchId,
        doctorId,
      }
    );

    await connection.commit();

    return res.status(200).json({
      message: "Doctor profile updated successfully",
      doctorId,
    });
  } catch (error) {
    console.error("Doctor profile update error:", error);

    if (connection) {
      try {
        await connection.rollback();
      } catch (_) {}
    }

    return res.status(500).json({
      error: "Failed to update doctor profile",
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeError) {
        console.error("Error closing DB connection:", closeError);
      }
    }
  }
};