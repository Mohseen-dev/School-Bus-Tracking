import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { Trip } from "../../models/Trip.model.js";
import { Driver } from "../../models/Driver.model.js";

export const currentTrip = asyncHandler(async (req, res) => {
  const driverId = req.driver?._id;
  if (!driverId) throw new ApiError(400, "DriverId is required , login again");

  const currentTrip = await Trip.findOne({
    driverId: driverId,
    status: "started",
  });

  res
    .status(200)
    .json(new ApiResponse(200, currentTrip, "successfull fetch current Trip"));
});
