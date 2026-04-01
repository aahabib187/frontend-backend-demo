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
// const connectDB = require("../db/connection");

// exports.updateDoctorProfile = async (req, res) => {
//   const {
//     email,
//     licenseNumber,
//     degrees,
//     experienceYears,
//     deptId,
//     branchId,
//   } = req.body;

//   let connection;

//   console.log("1. Request received");
//   console.log("2. req.body =", req.body);

//   if (
//     !email ||
//     !licenseNumber ||
//     !degrees ||
//     experienceYears === undefined ||
//     deptId === undefined ||
//     branchId === undefined
//   ) {
//     console.log("3. Validation failed");
//     return res.status(400).json({
//       error: "email, licenseNumber, degrees, experienceYears, deptId, and branchId are required",
//     });
//   }

//   try {
//     console.log("4. Connecting to DB...");
//     connection = await connectDB();
//     console.log("5. DB connected");

//     console.log("6. Running SELECT...");
//     const result = await connection.execute(
//       `SELECT d.ID
//        FROM DOCTOR d
//        JOIN USERS u
//          ON d.USER_ID = u.ID
//        WHERE TRIM(LOWER(u.EMAIL)) = TRIM(LOWER(:email))
//          AND TRIM(UPPER(u.ROLE)) = 'DOCTOR'`,
//       { email }
//     );
//     console.log("7. SELECT done");
//     console.log("8. result.rows =", result.rows);

//     if (result.rows.length === 0) {
//       console.log("9. Doctor not found");
//       return res.status(404).json({
//         error: "Doctor profile not found for this email",
//       });
//     }

//     const doctorId = result.rows[0][0];
//     console.log("10. doctorId =", doctorId);

//     console.log("11. Running UPDATE...");
//     const updateResult = await connection.execute(
//       `UPDATE DOCTOR
//        SET LICENSE_NUMBER = :licenseNumber,
//            DEGREES = :degrees,
//            EXPERIENCE_YEARS = :experienceYears,
//            DEPT_ID = :deptId,
//            BRANCH_ID = :branchId
//        WHERE ID = :doctorId`,
//       {
//         licenseNumber,
//         degrees,
//         experienceYears,
//         deptId,
//         branchId,
//         doctorId,
//       }
//     );
//     console.log("12. UPDATE done");
//     console.log("13. rowsAffected =", updateResult.rowsAffected);

//     console.log("14. Committing...");
//     await connection.commit();
//     console.log("15. Commit done");

//     return res.status(200).json({
//       message: "Doctor profile updated successfully",
//       doctorId,
//     });
//   } catch (error) {
//     console.error("Doctor profile update error:", error);

//     if (connection) {
//       try {
//         await connection.rollback();
//       } catch (rollbackError) {
//         console.error("Rollback error:", rollbackError);
//       }
//     }

//     return res.status(500).json({
//       error: "Failed to update doctor profile",
//       details: error.message,
//     });
//   } finally {
//     if (connection) {
//       try {
//         await connection.close();
//         console.log("16. Connection closed");
//       } catch (closeError) {
//         console.error("Error closing DB connection:", closeError);
//       }
//     }
//   }
// };