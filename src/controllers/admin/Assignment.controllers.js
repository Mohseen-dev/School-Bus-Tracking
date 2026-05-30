// import { Bus } from "../../models/Bus.model.js";
// import { Driver } from "../../models/Driver.model.js";
// import ApiError from "../../utils/ApiError.js";
// import ApiResponse from "../../utils/ApiResponse.js";
// import asyncHandler from "../../utils/asyncHandler.js";

import {Bus} from '../../models/Bus.model.js';
import {Driver} from '../../models/Driver.model.js';
import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';

export const assignDriverToBus = asyncHandler(async(req,res)=>{
    const {busId} = req.params;
    const {driverId} = req.body;

    if(!busId || !driverId){
        throw new ApiError(400, "Bus ID and Driver ID are required");
    }

    // check bus and driver exist or not

    const bus = await Bus.findById(busId);
    if(!bus) throw new ApiError(404, "Bus not found");

    const driver = await Driver.findById(driverId);
    if(!driver) throw new ApiError(404,"Driver not found");

    // check if bus already has a driver assigned
    if(bus.driverId) throw new ApiError(400, "Bus already has a driver assigned");

    // check if driver is already assigned to another bus
    const assignedBus = await Bus.findOne({driverId: driverId});
    if(assignedBus) throw new ApiError(400, "Driver is already assigned to another bus");

    // console.log("Bus and Driver found, proceeding with assignment");

    // assign driver to bus 
    const updatedBus = await Bus.findByIdAndUpdate(busId,{driverId:driverId},{new:true})
    const updatedDriver = await Driver.findByIdAndUpdate(driverId,{assignedBusId:busId},{new:true})

    res.status(201).json(new ApiResponse(201, {bus: updatedBus, driver: updatedDriver}, "Driver assigned to bus successfully"));




});



