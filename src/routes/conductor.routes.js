import express from "express";
import { loginConductor } from "../controllers/conductor/login.controller.js";
import { scanStudent } from "../controllers/conductor/scanAttendanceStudent.controller.js";
import { conductorAuthVerify } from "../Middlewares/conductor/conductorAuthVerify.js";
import { currentTrip } from "../controllers/conductor/currentTrip.controller.js";
import { getConductor } from "../controllers/conductor/getConductor.controller.js";
const conductorRouter = express.Router();

conductorRouter.post("/login", loginConductor);
conductorRouter.post("/scan-Student", conductorAuthVerify, scanStudent);
conductorRouter.get("/current-trip", conductorAuthVerify, currentTrip);
conductorRouter.get("/get-conductor", conductorAuthVerify, getConductor);

export default conductorRouter;
