// import { Bus } from "../../models/Bus.model.js";
// import { Driver } from "../../models/Driver.model.js";
// import ApiError from "../../utils/ApiError.js";
// import ApiResponse from "../../utils/ApiResponse.js";
// import asyncHandler from "../../utils/asyncHandler.js";

import { Bus } from "../../models/Bus.model.js";
import { Conductor } from "../../models/Conductor.model.js";
import { Driver } from "../../models/Driver.model.js";
import { Route } from "../../models/Route.model.js";
import { Student } from "../../models/Student.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const assignDriverToBus = asyncHandler(async (req, res) => {
  const { busId } = req.params;
  const { driverId } = req.body;

  if (!busId || !driverId) {
    throw new ApiError(400, "Bus ID and Driver ID are required");
  }

  // check bus and driver exist or not

  const bus = await Bus.findById(busId);
  if (!bus) throw new ApiError(404, "Bus not found");

  const driver = await Driver.findById(driverId);
  if (!driver) throw new ApiError(404, "Driver not found");

  // check if bus already has a driver assigned
  if (bus.driverId)
    throw new ApiError(400, "Bus already has a driver assigned");

  // check if driver is already assigned to another bus
  const assignedBus = await Bus.findOne({ driverId: driverId });
  if (assignedBus)
    throw new ApiError(400, "Driver is already assigned to another bus");

  // console.log("Bus and Driver found, proceeding with assignment");

  // assign driver to bus
  const updatedBus = await Bus.findByIdAndUpdate(
    busId,
    { driverId: driverId },
    { new: true }
  );
  const updatedDriver = await Driver.findByIdAndUpdate(
    driverId,
    { assignedBusId: busId },
    { new: true }
  );
  if (!updatedBus || !updatedDriver)
    throw new ApiError(500, "Something is wrong while assiging Driver to Bus");

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { bus: updatedBus, driver: updatedDriver },
        "Driver assigned to bus successfully"
      )
    );
});

export const assignConductorToBus = asyncHandler(async (req, res) => {
  const { busId } = req.params;
  const { conductorId } = req.body;

  if (!busId || !conductorId)
    throw new ApiError(400, "BusId and ConductorId is required");

  // check bus is exist or not
  const bus = await Bus.findById(busId);
  if (!bus) throw new ApiError(404, "Bus not found");

  // check bus already has conductor
  if (bus.conductorId)
    throw new ApiError(400, "Bus already has a conductor assigned");

  // check conductor is exist or not.
  const conductor = await Conductor.findById(conductorId);
  if (!conductor) throw new ApiError(404, "Conductor not found");

  // check conductor is assiged to another bus
  const isConductorBusy = await Bus.findOne({ conductorId: conductorId });
  if (isConductorBusy)
    throw new ApiError(400, "Conductor is already assigned to another bus");

  // assign conductor to bus
  const updateBus = await Bus.findByIdAndUpdate(
    busId,
    { conductorId: conductorId },
    { new: true }
  );
  const updateConductor = await Conductor.findById(
    conductorId,
    { assignedBusId: busId },
    { new: true }
  );
  if (!updateBus || !updateConductor)
    throw new ApiError(
      500,
      "Something is wrong while assiging Conductor to Bus"
    );

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { BUs: updateBus, Conductor: updateConductor },
        "successfully updated Conductor"
      )
    );
});

export const assignedRouteToBus = asyncHandler(async (req, res) => {
  const { busId } = req.params;
  const { routeId } = req.body;

  if (!busId || !routeId)
    throw new ApiError(400, "BusId and RouteId is required");

  // check bus exist or not
  const bus = await Bus.findById(busId);
  if (!bus) throw new ApiError(404, "Bus not found");

  // check already have route
  if (bus && bus.routeId) throw new ApiError(400, "Bus already has a route");

  // check route exist or not
  const route = await Route.findById(routeId);
  if (!route) throw new ApiError(404, "Route not found");

  // check route already assigned to another bus

  const isRouteBusy = await Bus.findOne({ routeId: routeId });
  if (isRouteBusy)
    throw new ApiError(400, "Route is already assigned to another Bus");

  // assigne route to bus
  const updatedBus = await Bus.findByIdAndUpdate(
    busId,
    { routeId: routeId },
    { new: true }
  );

  if (!updatedBus)
    throw new ApiError(500, "Something is wrong while assiging Route to Bus");

  res
    .status(200)
    .json(
      new ApiResponse(
        201,
        { Bus: updatedBus },
        "Successfully assigned route to Bus"
      )
    );
});

export const assignStudentToBus = asyncHandler(async (req,res)=>{
  const {studentId} = req.params;
  const {busId} = req.body;

  // validate input
  if(!studentId || !busId){
    throw new ApiError(400,"StudentId and BusId is required");
  }

  // check student exist or not
  const student = await Student.findById(studentId);
  if(!student){
    throw new ApiError(404,"Student not found");
  }
  // check student already assigned to bus
  if(student.assignedBusId){
    throw new ApiError(400,"Student already assigned to other bus");
  }
  // check bus exist or not
  const bus = await Bus.findById(busId);
  if(!bus){
    throw new ApiError(404,"Bus not found");
  }
  // check bus capacity if full or not
  const assignedStudentsCount = await Student.countDocuments({assignedBusId: busId});
  if(assignedStudentsCount >= bus.capacity){
    throw new ApiError(400,"Bus is full");
  }
  const updatedStudent = await Student.findByIdAndUpdate(studentId,{assignedBusId:busId},{new:true});
  if(!updatedStudent){
    throw new ApiError(500,"Something went wrong while assigning student to bus");
  }

  res.status(200).json(new ApiResponse(200, updatedStudent, "Successfully assigned student to bus"));
})
