import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { Conductor } from "../../models/Conductor.model.js";

export const createConductor = asyncHandler(async (req, res) => {
  const { name, email, password, phone, assignedBusId } = req.body;

  if (
    [name, email, password].some((item) => item === undefined || item === null)
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // check duplicacy of Conductor
  const conductor = await Conductor.findOne({ email });
  if (conductor) {
    throw new ApiError(400, "Conductor with this email already exists.");
  }

  // create Conductor
  const newConductor = await Conductor.create({
    name,
    email,
    password,
    phone,
  });

  if (!newConductor) {
    throw new ApiError(500, "Failed to create Conductor");
  }

  res
    .status(201)
    .json(
      new ApiResponse(201, newConductor, "Conductor created successfully.")
    );
});

export const getConductor = asyncHandler(async (req, res) => {
  const conductorId = req.params.id;
  if (!conductorId) throw new ApiError(400, "Conductor Id is required.");

  const conductor = await Conductor.findById(conductorId);
  if (!conductor) throw new ApiError(404, "Conductor not Found.");

//   console.log(conductor);
  res
    .status(200)
    .json(new ApiResponse(200, conductor, "conductor fetched successfully."));
});

export const getConductors = asyncHandler(async (req, res) => {
  const conductors = await Conductor.find();
  if (!conductors) throw new ApiError(404, "No Conductor found.");

  res
    .status(200)
    .json(new ApiResponse(200, conductors, "Conductors fetched successfully"));
});
