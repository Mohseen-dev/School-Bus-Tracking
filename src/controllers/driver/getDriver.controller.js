import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const getDriver = asyncHandler(async (req, res) => {
  const driverId = req.driver?._id;
  if (!driverId) throw new ApiError(400, "DriverId is required , login again");

  res
    .status(200)
    .json(new ApiResponse(200, req.driver), "successfully fetched driver");
});
