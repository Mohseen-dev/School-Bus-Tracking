// Algorithm
// 1. find driverId from req.driver(from middleware);
// 2. find {tripId,lng,lat,speed} from req.body;
// 3. validate this fields
// 4. find trip from database using tripId
// 5. validate trip status
// 6. validate driver
// 7. update bus location
// 8. return

import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { Trip } from "../../models/Trip.model.js";
import { Location } from "../../models/Location.model.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const sendBusLocation = asyncHandler(async (req, res) => {
  const driverId = req.driver._id;
  const { tripId, lng, lat, speed } = req.body;

  console.log(driverId);

  if (!driverId || !tripId || !lng || !lat || !speed) {
    throw new ApiError(
      400,
      "driverId and TripId and location detail are required"
    );
  }

  // find trip

  const trip = await Trip.findById(tripId);

  // validate this trip
  if (!trip) throw new ApiError(404, "Trip not found");

  // validate trip status
  if (trip.status !== "started") {
    throw new ApiError(404, "Trip not acitve or expire");
  }

  // validate driver
  //   console.log(trip.driverId)
  //   console.log(trip.driverId.toString());
  //   console.log(driverId);
  //   console.log(trip.driverId == driverId);
  //   console.log(trip.driverId.toString() == driverId);
  console.log(trip.driverId.toString() != driverId);
  //   console.log(trip.driverId != driverId);
  //   console.log(trip.driverId !== driverId);

  if (trip.driverId.toString() != driverId) {
    throw new ApiError(403, "Unauthorized Driver");
  }

  // update bus locaiton
  const updateBusLocation = await Location.findOneAndUpdate(
    { tripId },
    { lat, lng, speed },
    {
      upsert: true,
      new: true,
    }
  );

  // validate
  if (!updateBusLocation)
    throw new ApiError(500, "Something wrong while updating Bus Location");

  // return
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updateBusLocation,
        "Successfully create or updating Bus Location"
      )
    );
});
