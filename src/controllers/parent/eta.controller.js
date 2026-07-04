import { Location } from "../../models/Location.model.js";
import { Student } from "../../models/Student.model.js";
import { Trip } from "../../models/Trip.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { calculateDistance } from "../../utils/calculateDistance.js";

export const eta = asyncHandler(async (req, res) => {
  const parentId = req.parent?._id;
  const studentId = req.params?.studentId;

  if (!studentId) throw new ApiError(400, "StudentId is required");

  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");
  if (student.parentId.toString() !== parentId.toString())
    throw new ApiError(403, "Unathourized");
  if (!student.assignedBusId)
    throw new ApiError(400, "Student not assigned to any bus");

  //   trip
 
  const trip = await Trip.findOne({
    busId: student.assignedBusId,
    status: "started",
  }).sort({ createdAt: -1 });
  if (!trip) {
    return res.status(200).json(new ApiResponse(200, null, "Trip not active "));
  }

  //   bus location

  const busLocation = await Location.findOne({
    tripId: trip._id,
  });
  if (!busLocation) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Bus location not available"));
  }

  // creat some stuff for calulate eta
    const busCoordinate = {
      lat: busLocation.lng,
      lon: busLocation.lat,
    };
//   const busCoordinate ={ lat:0.0, lon: 0.0};
  const speed = busLocation.speed;
// const speed = 20;

  if (!speed && speed <= 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Bus currently stopped"));
  }

  const studentCoordinate = {
    lat: student.pickupLocation.lat,
    lon: student.pickupLocation.lng,
  };
//  const studentCoordinate = { lat: 90.0, lon: 0.0 };

  // call calculateDistance function to find distance with respect to  longitude and latitude

  const distance = calculateDistance(busCoordinate, studentCoordinate);

  const timeInHours = distance / speed;

  const etaInMinutes = Math.round(timeInHours * 60);

  const apiResponse = {
    studentName: student.studentName,
    distance: distance.toFixed(2) + " km",
    eta: etaInMinutes + " min",
    speed: speed + " km/h",
  };

  return res
    .status(200)
    .json(new ApiResponse(200, apiResponse, "ETA calculated successfully"));
});
