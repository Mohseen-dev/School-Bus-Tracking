// ! Algorithm for admin authentication verification middleware
// 1.get Admin Token from cookies
// 2.if Admin Token not found, retrun ERROR("token is not found , please login again");
// 3.if exist, decode token using signature and get adminId and role
// 4.if role is not equal to "Admin" && adminId not exist ,return ERROR("you are not a allowed");
// 5.using this adminId ,find Admin from DB
// 6.if Admin found,then add new object into "req" by the name of "admin "; {i.e req.admin =findedAdmi (except password)}
// 7.if not found,return ERROR("Admin no longer exists")
// 8.call next();

import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import jwt from "jsonwebtoken";
import {Admin} from "../../models/Admin.model.js";

export const authVerify = asyncHandler(async (req, res, next) => {
  const adminToken =
    req.cookies?.adminAccessToken ||
    req.headers["authorization"]?.replace("Bearer ", "");

  if (!adminToken) {
    throw new ApiError(404, "token is not found , please login again");
  }

  const adminDataFromToken = await jwt.verify(
    adminToken,
    process.env.JWT_SECRET_KEY
  );
  if (
    !adminDataFromToken ||
    adminDataFromToken.role !== "admin" ||
    !adminDataFromToken.adminId
  ) {
    throw new ApiError(403, "Not Allowed to access this route");
  }

  const findedAdmin = await Admin.findById(adminDataFromToken.adminId);

  if (!findedAdmin) {
    throw new ApiError(404, "Admin no longer exists");
  }
  req.admin = findedAdmin;
  next();
});
