// Algorithm
// 1. get Driver Token from cookies or authorization header
// 2. if Driver token not found -> return error(404,"token is not found , please login again");
// 3. if exist , decode token using signature and get driverId ;
// 4. if driverId not exist -> return error(403,"Not allowed to access this route");
// 5. using this driverId , find driver from DB
// 6. if driver found, then add new object into "req" by the name of "driver "; {i.e req.driver =findedDriver (except password)}
// 7. if not found -> return error(404,"Driver no longer exists")
// 8. call next();

import { Driver } from "../../models/Driver.model.js";
import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const driverAuthVerify = asyncHandler(async (req, res, next) => {
  // get token from cookies or authorization header
  const driverToken =
    req.cookies?.driverAccessToken ||
    req.headers["authorization"]?.replace("Bearer ", "");

  // if token not found
  if (!driverToken) {
    throw new ApiError(404, "token is not found , please login again");
  }

  // if token exist , decode token using signature
  const driverDataFromToken = await jwt.verify(
    driverToken,
    process.env.JWT_SECRET_KEY
  );

  // validate
  if (!driverDataFromToken || !driverDataFromToken.driverId) {
    throw new ApiError(403, "Not allowed to access this route");
  }

  // find driver
  const findedDriver = await Driver.findById(driverDataFromToken.driverId);

  // if not exist
  if (!findedDriver) {
    throw new ApiError(404, "Admin no longer exists");
  }

  req.driver = findedDriver;
  next();
});
