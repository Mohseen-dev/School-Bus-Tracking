import express from "express";
import { parentLogin } from "../controllers/parent/login.controller.js";
import { getProfile } from "../controllers/parent/getProfile.controller.js";
import { currentTripForStudent } from "../controllers/parent/currentTripForStudent.controller.js";
import { studentStatus } from "../controllers/parent/studentStatus.controller.js";
import { busLocation } from "../controllers/parent/busLocation.controller.js";
import { parentAuthVerify } from "../Middlewares/parent/parentAuthVerify.js";
import { eta } from "../controllers/parent/eta.controller.js";
const parentRouter = express.Router();

parentRouter.post("/login", parentLogin); //done
parentRouter.get("/get-profile", parentAuthVerify, getProfile); //done
parentRouter.get("/student-status/:studentId", parentAuthVerify, studentStatus); //done
parentRouter.get(
  "/current-trip/:studentId",
  parentAuthVerify,
  currentTripForStudent
); //done
parentRouter.get("/bus-location/:tripId", parentAuthVerify, busLocation);
parentRouter.get("/eta/:studentId", parentAuthVerify, eta);

export default parentRouter;
