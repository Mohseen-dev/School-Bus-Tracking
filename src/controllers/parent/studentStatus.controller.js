import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { Trip } from "../../models/Trip.model.js";
import { Student } from "../../models/Student.model.js";
import { Location } from "../../models/Location.model.js";
import { Attendance } from "../../models/Attendance.model.js";

export const studentStatus = asyncHandler(async (req, res) => {
  const parentId = req.parent?._id;
  const { studentId } = req.params;
  if (!studentId) {
    throw new ApiError(400, "Student ID is required");
  }
  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");

  if (student.parentId.toString() !== parentId.toString())
    throw new ApiError(403, "Unauthorized");

  if (!student.assignedBusId) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Student is not assigned to any bus"));
  }

  const trip = await Trip.findOne({
    busId: student.assignedBusId,
    status: "started",
  }).sort({ createdAt: -1 });

  if (!trip) {
    return res.status(200).json(new ApiResponse(200, null, "No active trip"));
  }

  const attendance = await Attendance.findOne({
    tripId: trip._id,
    studentId: studentId,
  });

  if (!attendance) throw new ApiError(404, "Attendance not found");

  const busLocation = await Location.findOne({ tripId: trip._id });
  if (!busLocation) {
    return res.status(200).json(
      new ApiResponse(200, {
        studentName: student.studentName,
        status: attendance.status,
        busLocation: null,
        lastUpdated: null,
      }),
      "Bus location not available yet"
    );
  }

  const apiResponsedata = {
    studentName: student.studentName,
    status: attendance.status,
    busLocation: busLocation
      ? {
          lat: busLocation.lat,
          lng: busLocation.lng,
        }
      : null,

    lastUpdated: busLocation.updatedAt,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, apiResponsedata, "Successfully fetch Student status")
    );
});
