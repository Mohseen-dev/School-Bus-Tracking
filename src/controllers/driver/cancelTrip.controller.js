// Algorithm
// 1. find driverId from req.driver (middleware);
// 2. extract tripId from req.body;
// 3. validate
// 4. find trip
// 5. validate , trip active or not (already cancelled);
// 6.validate driver
// 7.update Trip status as trip cancelled
// 8.find remaining student
// 9. return response

import { Attendance } from "../../models/Attendance.model.js";
import { Trip } from "../../models/Trip.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const cancelTrip = asyncHandler(async (req, res) => {
  const driverId = req.driver?._id;
  const { tripId } = req.body;

  if (!tripId || !driverId)
    throw new ApiError(400, "tripId and DriverId is required");

  const trip = await Trip.findById(tripId);
  if (!trip) throw new ApiError(404, "Trip not found");

  if (trip?.status == "cancelled" || trip.status == "completed")
    throw new ApiError(400, "Trip Already cancelled or completed ");

  if (trip?.driverId.toString() != driverId)
    throw new ApiError(403, "Unauthorized");

  //   remaining
  const remainingStudentCount = await Attendance.countDocuments({
    $and: [{ tripId: tripId }, { status: "not_boarded" }],
  });

  const updateTripToCancel = await Trip.findByIdAndUpdate(tripId, {
    status: "cancelled",
    endTime: new Date(),
  });

  if (!updateTripToCancel)
    throw new ApiError(500, "Something wrong while cancel trip");

  //
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updateTripToCancel, remainingStudentCount },
        "successfully cancelled trip"
      )
    );
});
