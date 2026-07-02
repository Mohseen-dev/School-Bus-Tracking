import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { Trip } from "../../models/Trip.model.js";
import { Student } from "../../models/Student.model.js";
import { Attendance } from "../../models/Attendance.model.js";

export const scanStudent = asyncHandler(async (req, res) => {
  // ==========(Extractor Section) Extract Information from Request ==========

  // console.log("req.conductor", req.conductor);
  const conductorId = req.conductor?._id;
  // console.log("this is conductorId from middleware : ", conductorId);

  const { tripId, qrCode, type, mode, rollNumber } = req.body;
  // console.log(
  //   "TripId and QrCode from req.body : ",
  //   tripId,
  //   qrCode,
  //   type,
  //   mode,
  //   rollNumber
  // );

  // =========(Validation Section) Validate the Request's Extracted Information =======

  if (!tripId || !type || !mode)
    throw new ApiError(400, "tripId,mode and type are required");

  if (mode === "qr" && !qrCode)
    throw new ApiError(400, "qrCode is required for QR mode");

  if (mode === "manual" && !rollNumber)
    throw new ApiError(400, "rollNumber is required for Manual mode");

  if (type !== "board" && type !== "drop")
    throw new ApiError(400, "type must be either 'board' or 'drop'");

  // ===========(Processing Section) Process the Request or( find Current Trip and Student and Validate them) ======

  // ====(Trip  & ValidationSection)====
  const currentTrip = await Trip.findById(tripId);
  if (!currentTrip) throw new ApiError(404, "Trip not found ");
  // console.log("currentTrip detail from : ", currentTrip);

  if (currentTrip.status !== "started")
    throw new ApiError(400, "Trip not active");

  if (currentTrip.conductorId.toString() !== conductorId.toString())
    throw new ApiError(403, "UnAuthorized");

  const attendanceMethod = mode; // Set the Attendance method based on the mode (either 'qr' or 'manual')

  // ==== (student & validation section)=====================
  let student;

  if (mode === "manual") {
    student = await Student.findOne({ rollNumber });
    // attendanceMethod = "manual";
  } else if (mode === "qr") {
    student = await Student.findOne({ qrCode });
    // attendanceMethod = "qr";
  } else {
    throw new ApiError(
      400,
      "Invalid mode. Mode must be either 'qr' or 'manual'"
    );
  }

  if (!student) throw new ApiError(404, "Student not found");

  // ==== (Bus Validation section)=======

  if (!student.assignedBusId)
    throw new ApiError(400, "Student not assigned to any bus");

  if (student.assignedBusId.toString() !== currentTrip.busId.toString())
    throw new ApiError(400, "Student not assigned to this bus");

  //   ===== ( Attendance and Validation Section) =====
  const attendance = await Attendance.findOne({
    tripId,
    studentId: student?._id,
  });
  // console.log("attendnce from DB of Student ", attendance);
  if (!attendance)
    throw new ApiError(
      404,
      "Attendance record not found for this student and trip"
    );

  //   ====== ( Attendance Update section and Validation section)=======

  // ===== on boarding the Student =====

  if (type === "board") {
    if (attendance && attendance.status === "not_boarded") {
      // update attendance status to boarded
      const updateAttendance = await Attendance.findOneAndUpdate(
        { tripId, studentId: student?._id },
        {
          status: "boarded",
          boardedAt: new Date(),
          method: attendanceMethod,
          verifiedBy: conductorId,
        },
        { new: true }
      );

      //   increment the boardedCount in Trip model
      const updateTrip = await Trip.findByIdAndUpdate(
        tripId,
        { $inc: { boardedCount: 1 } },
        { new: true }
      );

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            attendance: updateAttendance,
            boardedCount: updateTrip.boardedCount,
          },
          "Student boarded successfully"
        )
      );
    } else {
      throw new ApiError(400, "Student already boarded");
    }
  }

  // ====== on dropping the Student  =====

  if (type === "drop") {
    if (attendance && attendance.status === "boarded") {
      // update attendance status to dropped
      const updateAttendance = await Attendance.findOneAndUpdate(
        { tripId, studentId: student?._id },
        {
          status: "dropped",
          droppedAt: new Date(),
          method: attendanceMethod,
          verifiedBy: conductorId,
        },
        { new: true }
      );
      //   calculate remaining student left to drop
      const remainingStudents = await Attendance.countDocuments({
        tripId,
        status: "boarded",
      });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { Attendance: updateAttendance, remainingStudents },
            "Student dropped successfully"
          )
        );
    } else if (attendance && attendance.status === "not_boarded") {
      throw new ApiError(400, "Student has not boarded yet, cannot drop");
    } else {
      throw new ApiError(400, "Student has already dropped ");
    }
  }
});
