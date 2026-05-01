import { Bus } from "../../models/Bus.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

// createBus Algorithm : ---   {// // ! Algorithm to create a bus
// 1. get adminId from req.admin

// 2. extract input
//    { busNumber, vehicleNumber, capacity }

// 3. validate input
//    if (!busNumber || !vehicleNumber || !capacity)
//    → ERROR(400, "All fields are required")

// 4. check duplicate
//    if (busNumber exists OR vehicleNumber exists)
//    → ERROR(400, "Bus already exists")

// 5. create bus
//    Bus.create({
//      busNumber,
//      vehicleNumber,
//      capacity,
//      isActive: true,
//      createdBy: adminId   // optional audit
//    })

// 6. return response
//    SUCCESS(201, "Bus created successfully")
// }

export const createBus = asyncHandler(async (req, res) => {
  const adminId = req.admin._id;
  const { busNumber, vehicleNumber, capacity } = req.body;

  // validate input
  if (!busNumber || !vehicleNumber || !capacity) {
    throw new ApiError(400, "All fields are required");
  }

  // check duplicate
  const existingBus = await Bus.findOne({
    $or: [{ busNumber }, { vehicleNumber }],
  });
  if (existingBus) {
    throw new ApiError(400, "Bus already exists");
  }

  // create bus
  const newBus = await Bus.create({
    busNumber,
    vehicleNumber,
    capacity,
    isActive: true,
  });

  res
    .status(201)
    .json(new ApiResponse(201, newBus, "Bus created successfully"));
});

export const getBus = asyncHandler(async (req, res) => {
  const busId = req.params.id;

  if (!busId) {
    throw new ApiError(400, "BusId is required");
  }

  const bus = await Bus.findById(busId);

  if (!bus) throw new ApiError(404, "Bus not found");

  res.status(200).json(new ApiResponse(200, bus, "Bus fetched successfully"));
});

export const getAllBuses = asyncHandler(async (req, res) => {
  const allBus = await Bus.find();
  if (allBus?.length === 0) {
    res.status(200).json(new ApiResponse(200, allBus, "No Bus found"));
  }
  res
    .status(200)
    .json(new ApiResponse(200, allBus, "Successfully fetched all Bus"));
});
