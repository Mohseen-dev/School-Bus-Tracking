import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";

export const getProfile = asyncHandler(async (req, res) => {
  const parentId = req.parent._id;
  if (parentId) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, req.parent, "Successfully fetch Parent Profile")
      );
  } else {
    throw new ApiError(404, "Invalid Request or Parent not found");
  }
});
