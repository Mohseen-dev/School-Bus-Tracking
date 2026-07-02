import { Conductor } from "../../models/Conductor.model.js";
import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const conductorAuthVerify = asyncHandler(async (req, res, next) => {
  const conductorToken =
    req.cookies?.conductorAccessToken ||
    req.headers["authorization"]?.replace("Bearer ", "");

  if (!conductorToken)
    throw new ApiError(404, "token is not found , please login again");

  const conductorDataFromToken = await jwt.verify(
    conductorToken,
    process.env.JWT_SECRET_KEY
  );

  if (!conductorDataFromToken || !conductorDataFromToken.conductorId) {
    throw new ApiError(403, "Not allowed to access this route");
  }

  const findedConductor = await Conductor.findById(
    conductorDataFromToken.conductorId
  );
  if (!findedConductor)
    throw new ApiError(404, "Conductor not found or no longer exists");

  req.conductor = findedConductor;
  next();
});
