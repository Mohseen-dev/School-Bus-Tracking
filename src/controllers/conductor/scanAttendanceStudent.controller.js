import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { Trip } from "../../models/Trip.model.js";
import { Student } from "../../models/Student.model.js";
import { Attendance } from "../../models/Attendance.model.js";

export const scanStudent = asyncHandler(async (req, res) => {
  console.log("req.conductor", req.conductor);
  const conductorId = req.conductor?._id;
  console.log("this is conductorId from middleware : ", conductorId);

  const { tripId, qrCode, type } = req.body;
  console.log("TripId and QrCode from req.body : ", tripId, qrCode);

  if (!tripId || !qrCode || !type)
    throw new ApiError(400, "tripId, qrCode, and type are required");

  if (type !== "board" && type !== "drop")
    throw new ApiError(400, "type must be either 'board' or 'drop'");

  const currentTrip = await Trip.findById(tripId);
  if (!currentTrip) throw new ApiError(404, "Trip not found ");
  console.log("currentTrip detail from : ", currentTrip);

  if (currentTrip.status !== "started")
    throw new ApiError(400, "Trip not active");

  if (currentTrip.conductorId.toString() !== conductorId.toString())
    throw new ApiError(403, "UnAuthorized");

  //   Student

  const student = await Student.findOne({ qrCode });
  if (!student) throw new ApiError(404, "Invalid QR Code");
  console.log("Student detail form DB : ", student);

  if(!student.assignedBusId)
    throw new ApiError(400, "Student not assigned to any bus");

  if (student.assignedBusId.toString() !== currentTrip.busId.toString())
    throw new ApiError(400, "Student not assigned to this bus");

  //   Attendance
  const attendance = await Attendance.findOne({
    tripId,
    studentId: student?._id,
  });
  console.log("attendnce from DB of Student ", attendance);
  if (!attendance)
    throw new ApiError(
      404,
      "Attendance record not found for this student and trip"
    );

  //   core concept of scanning student
  if (type === "board") {
    if (attendance && attendance.status === "not_boarded") {
      // update attendance status to boarded
      const updateAttendance = await Attendance.findOneAndUpdate(
        { tripId, studentId: student?._id },
        { status: "boarded", boardedAt: new Date() },
        { new: true }
      );

      //   increment the boardedCount in Trip model
      const updateTrip = await Trip.findByIdAndUpdate(
        tripId,
        { $inc: { boardedCount: 1 } },
        { new: true }
      );

      return res
        .status(200)
        .json(
          new ApiResponse(200, { updateAttendance, updateTrip }, "Student boarded successfully")
        );
    } else {
      throw new ApiError(400, "Student already boarded");
    }
  }

  if (type === "drop") {
    if (attendance && attendance.status === "boarded") {
      // update attendance status to dropped
      const updateAttendance = await Attendance.findOneAndUpdate(
        { tripId, studentId: student?._id },
        { status: "dropped", droppedAt: new Date() },
        { new: true }
      );
    //   calculate remaining student left to drop
        const remainingStudents = await Attendance.countDocuments({
          tripId,
          status: "boarded"
        });
      return res
        .status(200)
        .json(
          new ApiResponse(200, { updateAttendance, remainingStudents }, "Student dropped successfully")
        );
    } else if (attendance && attendance.status === "not_boarded") {
      throw new ApiError(400, "Student has not boarded yet, cannot drop");
    } else {
      throw new ApiError(400, "Student has already dropped ");
    }
  }
});
