import asyncHandler from "../../utils/asyncHandler.js";

export const getConductor = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        req.conductor,
        "Successfully fetched conductor details"
      )
    );
});
