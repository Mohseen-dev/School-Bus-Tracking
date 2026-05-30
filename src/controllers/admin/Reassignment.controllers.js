import { Bus } from "../../models/Bus.model.js";
import { Driver } from "../../models/Driver.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const reassignedDriverToBus = asyncHandler(async (req, res) => {
  const { busId } = req.params;
  const {driverId} = req.body; //new driver id is coming in request body
  console.log("Received request to reassign driver to bus:", busId, driverId);

  if (!busId || !driverId) {
    throw new ApiError(400, "Bus ID and Driver ID are required");
  }
  //   check bus exist or not
  const bus = await Bus.findById(busId);
  if (!bus) throw new ApiError(404, "Bus not found");

  //  check driver exist or not
  const driver = await Driver.findById({ _id: driverId });
  if (!driver) throw new ApiError(404, "Driver not found");

  //   check if driver is already assigned to  another bus
  const isDriverBusy = await Bus.findOne({ driverId: driverId });
  if (isDriverBusy) {
    throw new ApiError(
      400,
      "Driver is already assigned to another bus and Bus reassignment is not allowed"
    );
  }

  //   check same driver is assigned to same bus or not
  if (bus.driverId && bus.driverId.toString() === driverId) {
    throw new ApiError(400, "Same driver is already assigned to this bus");
  }

  //   remove bus from previously assigned driver
  if (bus.driverId) {
    await Driver.findByIdAndUpdate(
      bus.driverId,
      { assignedBusId: null },
      { new: true }
    );
  }

  // assign new driver to bus
  const updatedBus = await Bus.findByIdAndUpdate(
    busId,
    { driverId: driverId },
    { new: true }
  );
  // assign bus to driver
  const updatedDriver = await Driver.findByIdAndUpdate(
    driverId,
    { assignedBusId: busId },
    { new: true }
  );

  if (!updatedBus || !updatedDriver)
    throw new ApiError(500, "Failed to reassign driver to bus");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedBus: updatedBus, updatedDriver: updatedDriver },
        "Driver reassigned to bus successfully"
      )
    );
});
