// Algorithm
// 1. 1.get Driver detail from req.driver (via middleware)
// 2.get busId and tripType from frontend i.e req.body
// 3.validate , if driverId or busId or tripType empty , return ERROR({status:fail,message:"something is wrong.",statusCode:404})
// 4.we have Driver Detail from middleware , so that we can check this busId is match in with busId in Driver Detail.
// 5.If not match , return ERROR({status:fail,message:"you are have not authorized to start trip",statusCode:400})
// 6.check ,kya koi already trip tho nahi chal rahi iss bus ki via searching busId in Trip collection and check it's status is complete or not,if not completed then return ERROR({status:fail,message:"This bus already in trip",statusCode:400})
// 7.now fetch route of the bus, via searching busId in Bus collection and then searching routeId from Route collection.

import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { Bus } from "../../models/Bus.model.js";
import { Route } from "../../models/Route.model.js";
import { Trip } from "../../models/Trip.model.js";
import { Student } from "../../models/Student.model.js";
import { Attendance } from "../../models/Attendance.model.js";

export const startTrip = asyncHandler(async (req, res) => {
  // get driver
  const driverId = req.driver._id;
  console.log("req body is ", driverId);

  // get busId and tripType
  const { busId, tripType } = req.body;

  // validate
  if (!busId || !tripType) {
    throw new ApiError(404, "BusId and TripType is required");
  }

  if (req.driver?.assignedBusId?.toString() != busId) {
    throw new ApiError(403, "You have not authorized to start trip");
  }

  // validate bus
  const bus = await Bus.findById(busId);
  if (!bus) {
    throw new ApiError(404, "Bus not found");
  }

  //   validate Trip is already is started or not with this bus
  const isTripStartedWithThisBus = await Trip.findOne({
    busId: busId,
    status: "started",
  });
  //   console.log("another bus is exist or not",isTripStartedWithThisBus)

  if (
    isTripStartedWithThisBus &&
    isTripStartedWithThisBus?.status.toString() != "completed"
  ) {
    throw new ApiError(400, "This bus already in trip");
  }

  // fetch route of the bus
  const routeOfBus = await Route.findById(bus.routeId);
  if (!routeOfBus) {
    throw new ApiError(404, "Route is not Configured");
  }
  // console.log("this is route of the bus",routeOfBus.stops);

  // create routeSnapshot
  const routeSnapshot = routeOfBus?.stops;
  //   console.log(routeSnapshot);

  // find how many Student is allowed on that bus
  const Students = await Student.find({ assignedBusId: busId });
  //   console.log("students details are here : ", Students);

  const totalStudents = Students.length; // find the length
  //   console.log("total students", totalStudents);
  // console.log("total Student ",totalStudents);
  if (!Students || totalStudents < 0) {
    throw new ApiError(400, "There is not Student is allowed on that bus");
  }

  // create Trip
  const newTrip = await Trip.create({
    busId,
    driverId: req.driver?._id,
    conductorId: bus.conductorId,
    tripType,
    date: new Date(),
    status: "started",
    routeSnapshot,
    totalStudents,
    boardedCount: 0,
  });
  // // console.log("newTrip ",newTrip);
  if (!newTrip) {
    throw new ApiError(500, "Something is wrong while starting trip");
  }

  // create Array for attendance of each student for insert Many at once
  const attendanceStudentRecordForInsertMany = Students.map((student) => {
    return {
      studentId: student._id,
      tripId: newTrip._id,
      status: "not_boarded",
    };
  });
  //    console.log(attendanceStudentRecordForInsertMany);

  const initailAttendance = await Attendance.insertMany(
    attendanceStudentRecordForInsertMany
  );
  // console.log("attendane records : ",initailAttendance);

  //   return response;
  res
    .status(201)
    .json(new ApiResponse(201, newTrip, "successfully start trip"));
});
