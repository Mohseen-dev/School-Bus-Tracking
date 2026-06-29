// Algorithm
// 1. find DriverId from req.Driver(middleware);
// 2. find TripId from req.body;
// 3. validate
// 4. find Trip form database using tripId
// 5. validate trip i.e trip is active or not
// 6. validate Driver i.e trip's DriverId match with a Driver that raise request
// 7.calculate remaing student
// 8. update Trip as  trip End

import { Attendance } from "../../models/Attendance.model.js";
import { Trip } from "../../models/Trip.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const endTrip = asyncHandler(async (req, res) => {
  const driverId = req.driver?._id;
  const { tripId } = req.body;

  // req.body validation
  if (!tripId || !driverId)
    throw new ApiError(400, "TripId and DriverId is required");

  // find Trip
  const trip = await Trip.findById(tripId);
  if (!trip) throw new ApiError(404, "Trip not found");

  // validate Trip
  if (trip?.status !== "started")
    throw new ApiError(400, "Trip already ended or invalid");

  // validate Driver
  if (trip?.driverId.toString() != driverId)
    throw new ApiError(403, "UnAuthorized");

  //   find remaining Student

  // console.log(remainingStudent)
  // console.log(remainingStudentCount)

  const remainingStudentCount = await Attendance.countDocuments({
    $and: [{ tripId: tripId }, { status: "not_boarded" }],
  });

  // update Trip
  const updateTrip = await Trip.findByIdAndUpdate(
    tripId,
    {
      status: "completed",
      endTime: new Date(),
    },
    { new: true }
  );

  //   console.log("updateTrip : " + updateTrip);

  if (!updateTrip)
    throw new ApiError(500, "Something wrong while update Trip Status");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updateTrip, remainingStudentCount },
        "successfully end Trip"
      )
    );
});
