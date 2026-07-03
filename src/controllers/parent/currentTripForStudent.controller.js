import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { Student } from "../../models/Student.model.js";
import { Trip } from "../../models/Trip.model.js";

export const currentTripForStudent = asyncHandler(async (req, res) => {
  const parentId = req.parent._id;
  const { studentId } = req.params;
  if (!studentId) throw new ApiError(400, "Student ID is required");

  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");

  if (student.parentId.toString() !== parentId.toString())
    throw new ApiError(
      403,
      "You are not authorized to view this student's trip information"
    );
  const currentTripDoc = await Trip.findOne({
    busId: student.assignedBusId,
    status: { $in: ["scheduled", "started"] },
  }).populate("busId driverId conductorId");

  const currentTrip = currentTripDoc ? currentTripDoc  : "No Active Trip ";

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        currentTrip,
        "Current trip for student fetched successfully"
      )
    );
});
