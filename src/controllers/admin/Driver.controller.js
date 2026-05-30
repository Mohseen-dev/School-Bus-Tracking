import { Driver } from "../../models/Driver.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const createDriver = asyncHandler(async (req, res) => {

  console.log("Received request to create driver with data:", req.body);
  const {
    name,
    email,
    password,
    phone,
    licenseNumber,
    licenseExpiry,
    isActive,
  } = req.body;

  if (
    !name?.trim() ||
    !email?.trim() ||
    !password?.trim() ||
    !licenseNumber?.trim() ||
    !licenseExpiry
  ) {
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
    password: password.trim(),
    phone,
    licenseNumber,
    licenseExpiry,
    isActive,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newDriver, "Driver created successfully"));
});

export const getDriver = asyncHandler(async (req, res) => {
  // console.log(req.params.id)

  const id = req.params.id;
  const driver = await Driver.findById(id);

  if (!driver) {
    throw new ApiError(404, "Driver not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, driver, "Driver fetched successfully"));
});

export const getDrivers = asyncHandler(async (req, res) => {
  const allDrivers = await Driver.find();
  console.log(allDrivers);
  if (allDrivers?.length < 0) {
    res.status(200).json(new ApiResponse(200, allDrivers, "No Driver"));
  }
  res
    .status(200)
    .json(new ApiResponse(200, allDrivers, "fetched all Drivers successfully"));
});
