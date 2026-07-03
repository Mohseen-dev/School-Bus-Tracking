import { Parent } from "../../models/Parent.model.js";
import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const parentAuthVerify = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.parentAccessToken ||
    req.headers["authorization"]?.replace("Bearer ", "");

  if (!token) throw new ApiError(404, "Token not found , Please Login again");

  const tokenData = await jwt.verify(token, process.env.JWT_SECRET_KEY);

  if (!tokenData || !tokenData.parentId)
    throw new ApiError(403, "not allowed to access this route");

  const parent = await Parent.findById(tokenData.parentId);

  if (!parent) throw new ApiError(404, "Parent not found");

  const parentData = parent.toObject();
  delete parentData.password;

  req.parent = parentData;
  next();
});
