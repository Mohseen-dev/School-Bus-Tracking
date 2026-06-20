import { Route } from "../../models/Route.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const createRoute = asyncHandler(async (req, res) => {
  const { name, stops } = req.body;

  if (!name || !stops || stops.length < 2) {
    throw new ApiError(
      400,
      "Name and at least 2 stops are required to create a route."
    );
  }
  stops.forEach((stop, index) => {
    if (!stop.name || !stop.lat || !stop.lng || !stop.expectedTime) {
      throw new ApiError(
        400,
        `Stop at index ${index} is missing required fields (name, lat, lng, expectedTime).`
      );
    }
  });

  const orders = stops.map((stop)=> stop.order);
  const uniqueOrders = new Set(orders);
  if(uniqueOrders.size !== orders.length){
    throw new ApiError(400, "Stop orders must be unique.");
  }
  const existingRoute = await Route.findOne({ name });

  if (existingRoute) {
    throw new ApiError(400, "Route with this name already exists.");
  }

  const route = await Route.create({
    name: name.toLowerCase().trim(),
    stops: stops.map((stop) => ({
      ...stop,
    })),
  });

  res
    .status(201)
    .json(new ApiResponse(201, route, "Route created successfully."));
});

export const getRoute = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const route = await Route.findById(id);

  if (!route) throw new ApiError(404, "Route not exist or deleted");

  res
    .status(200)
    .json(new ApiResponse(200, route, "Route fetched successfully."));
});

export const getRoutes = asyncHandler(async (req, res) => {
  const routes = await Route.find();
  if (!routes) throw new ApiError(404, "No routes Found");

  if (routes.length === 0)
    res.status(200).json(new ApiResponse(200, routes, "No routes Added."));

  res
    .status(200)
    .json(new ApiResponse(200, routes, "Routes fetched successfully."));
});
