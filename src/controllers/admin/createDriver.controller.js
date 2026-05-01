import { Driver } from "../../models/Driver.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const createDriver = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    licenseNumber,
    licenseExpiry,
    assigneBusId,
    isActive,
  } = req.body;

  if (!name || !email || !password || !licenseExpiry || !licenseNumber) {
    throw new ApiError(400, "All fields are required");
  }

  const existingDriver = await Driver.findOne({
    $or: [{ email }, { licenseNumber }],
  });

  if (existingDriver) {
    throw new ApiError(
      409,
      "Driver with this email or license number already exists"
    );
  }

  const newDriver = await Driver.create({
    name,
    email,
    password,
    phone,
    licenseNumber,
    licenseExpiry,
    isActive,
  });

  if(!newDriver){
    throw new ApiError(500,"failed to create Driver");
  }
  res.status(201).json(
    new ApiResponse(201,newDriver,"Driver created Successfully")
  )
});

