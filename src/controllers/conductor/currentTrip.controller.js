import { Trip } from "../../models/Trip.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const currentTrip = asyncHandler(async (req, res) => {
  const conductorId = req.conductor?._id;

  const currentTripDoc = await Trip.findOne({
    conductorId,
    status: "started",
  });

  const currentTrip =
    currentTripDoc || "No active trip found for this conductor";

  return res
    .status(200)
    .json(new ApiResponse(200, currentTrip, "successfully fetch currentTrip"));
});
