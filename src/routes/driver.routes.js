import express from "express";
import { driverLogin } from "../controllers/driver/login.controller.js";
import { driverAuthVerify } from "../Middlewares/driver/driverAuthVerify.js";
import { startTrip } from "../controllers/driver/startTrip.controller.js";
import { sendBusLocation } from "../controllers/driver/sendLocation.controller.js";
import { endTrip } from "../controllers/driver/endTrip.controller.js";
import { cancelTrip } from "../controllers/driver/cancelTrip.controller.js";
const driverRouter = express.Router();

driverRouter.post("/login", driverLogin);
driverRouter.post("/start-trip", driverAuthVerify, startTrip);
driverRouter.post("/send-location", driverAuthVerify, sendBusLocation);
driverRouter.patch("/end-trip", driverAuthVerify, endTrip);
driverRouter.patch("/cancel-trip", driverAuthVerify, cancelTrip);

export default driverRouter;
