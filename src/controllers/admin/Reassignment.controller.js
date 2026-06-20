import { Bus } from "../../models/Bus.model.js";
import { Conductor } from "../../models/Conductor.model.js";
import { Driver } from "../../models/Driver.model.js";
import { Route } from "../../models/Route.model.js";
import { Student } from "../../models/Student.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const reassignedDriverToBus = asyncHandler(async (req, res) => {
  const { busId } = req.params;
  const { driverId } = req.body; //new driver id is coming in request body
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

export const reassignedConductorToBus = asyncHandler(async (req, res) => {
  const { busId } = req.params;
  const { conductorId } = req.body; // new conductorId coming from request body;

  if (!busId || !conductorId)
    throw new ApiError(400, "BusId and ConductorId is required");

  //check bus exits or not.
  const bus = await Bus.findById(busId);
  if (!bus) throw new ApiError(404, "Bus not found");

  // check conductor exists or not.
  const conductor = await Conductor.findById(conductorId);
  if (!conductor) throw new ApiError(404, "Conductor not found");

  // Conductor already assigned to another bus.
  const isConductorBusy = await Bus.findOne({ conductorId: conductorId });
  if (isConductorBusy)
    throw new ApiError(
      400,
      "Driver is already assigned to another bus and Bus reassignment is not allowed"
    );

  // same conductor is reassinging or not.
  if (bus.conductorId && bus.conductorId.toString() === conductorId)
    throw new ApiError(400, "Same Conductor is already assigned to this bus");

  // remove previous bus from conductor
  if (bus.conductorId) {
    await Conductor.findByIdAndUpdate(
      bus.conductorId,
      { assignedBusId: null },
      { new: true }
    );
  }

  // assign new Conductor to bus
  const updatedBus = await Bus.findByIdAndUpdate(
    busId,
    { conductorId: conductorId },
    { new: true }
  );

  // assign new Bus to Conductor
  const updatedConductor = await Conductor.findByIdAndUpdate(
    conductorId,
    { assignedBusId: busId },
    { new: true }
  );

  if (!updatedBus || !updatedConductor)
    throw new ApiError(500, "Failed to reassign Conductor to bus");

  res
    .status(201)
    .json(
      new ApiResponse(201, {
        updated_Bus: updatedBus,
        updated_Conductor: updatedConductor,
      },"Successfully updated Conductor")
    );
});

export const reassignedRouteToBus = asyncHandler(async (req, res) => {
  const {busId} = req.params;
  const {routeId} = req.body; // new routeId coming from request body

  if(!busId || !routeId) throw new ApiError(400,"BusId and RouteId is required");

  // find bus exist or not
  var bus = await Bus.findById(busId);
  if(!bus) throw new ApiError(404,"Bus not found");

  // find route exist or not
  const route = await Route.findById(routeId);
  if(!route ) throw new ApiError(404,"Route not found");

  // check if route is already assigned to another bus
  const isRouteBusy = await Bus.findOne({routeId:routeId});
  if(isRouteBusy) throw new ApiError(400,"Route is already assigned to another Bus");

  // check same route is assigned to same bus or not
  if(bus.routeId && bus.routeId.toString() === routeId) throw new ApiError(400,"Same Route is already assigned to this bus");

  // remove previou route form bus and assign new route to bus
  if(bus.routeId){
    bus = await Bus.findByIdAndUpdate(busId,{routeId:routeId},{new:true});
  }

  res.status(200).json(new ApiResponse(200,{updateBus : bus}),"Successfully updated Route to Bus");

  


})

export const reassignedStudentToBus = asyncHandler(async (req,res)=>{
  const {studentId} = req.params;
  const {busId} = req.body;

  if(!studentId || !busId) throw new ApiError(400,"StudentId and BusId is required");

  // check student exist or not
  const student = await Student.findById(studentId);
  if(!student) throw new ApiError(404,"Student not found");
  
  // check bus exist or not
  const bus = await Bus.findById(busId);
  if(!bus) throw new ApiError(404,"Bus not found");

  // check same student is assigned to same bus or not
  if(student.assignedBusId && student.assignedBusId.toString() === busId) throw new ApiError(400,"Same Student is already assigned to this bus");

  // remove previous bus from student and assign new bus to student
  const updatedStudent = await Student.findByIdAndUpdate(studentId,{assignedBusId:busId},{new:true});

  if(!updatedStudent) throw new ApiError(500,"Failed to reassign Student to bus");

  res.status(200).json(new ApiResponse(200,{updatedStudent:updatedStudent},"Successfully updated Student to Bus"));


})
