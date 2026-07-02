import { Parent } from "../../models/Parent.model.js";
import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const parentLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new ApiError(400, "Email and Password are required");

  const parent = await Parent.findOne({ email }).select("+password");
  if (!parent) throw new ApiError(404, "Parent not found");

  const ifPasswordCorrect = await parent.comparePassword(password);
  if (!ifPasswordCorrect) throw new ApiError(401, "Invalid Credentials");

  const token = await jwt.sign(
    {
      parentId: parent._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.COOKIE_EXPIRY,
    }
  );

  if (!token) throw new ApiError(500, "Something is wrong while login");

  const cookieOption = {
    httpOnly: true,
    secure: true,
  };

  const parentData = parent.toObject();
  delete parentData.password;

  res
    .status(200)
    .cookie("parentAccessToken", token)
    .json(new ApiResponse(200, parentData, "Successfully login"));
});
