import asyncHandler from '../../utils/asyncHandler.js'
import ApiError from '../../utils/ApiError.js'
import ApiResponse from '../../utils/ApiResponse.js'
import {Trip} from '../../models/Trip.model.js'
import {Student} from '../../models/Student.model.js'
import {Location} from '../../models/Location.model.js'


export const busLocation = asyncHandler(async (req, res) => {
  const parentId = req.parent._id;
  const { tripId } = req.params;
  if (!tripId) throw new ApiError(400, "Trip ID is required");

  const trip = await Trip.findById(tripId);
  if (!trip) {
    throw new ApiError(404, "Trip not found");
  }
  if (trip.status !== "started") {
    return res.status(200).json(new ApiResponse(200, null, "Trip not active"));
  }

  const student = await Student.findOne({
    parentId: parentId,
    assignedBusId: trip.busId,
  });
  if (!student) throw new ApiError(403, "Unauthorized");

  const busLocation = await Location.findOne({
    tripId: trip._id,
  });
  if (!busLocation) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Location not available"));
  }
  const apiResponse = {
    lat: busLocation.lat,
    lng: busLocation.lng,
    speed: busLocation.speed,
    lastUpdated: busLocation.updateAt,
  };
  return res
    .status(200)
    .json(new ApiResponse(200, apiResponse, "Successfully fetch Bus Location"));
});
