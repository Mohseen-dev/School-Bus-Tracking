import express from "express";
import { signUp } from "../controllers/admin/signUp.controller.js";
import { loginAdmin } from "../controllers/admin/login.controller.js";
import { authVerify } from "../Middlewares/admin/authVerify.js";
import {
  createBus,
  getAllBuses,
  getBus,
} from "../controllers/admin/Bus.controller.js";
import {
  createDriver,
  getDriver,
  getDrivers,
} from "../controllers/admin/Driver.controller.js";
import {
  createConductor,
  getConductor,
  getConductors,
} from "../controllers/admin/Conductor.controller.js";
import {
  createRoute,
  getRoute,
  getRoutes,
} from "../controllers/admin/Route.controllers.js";
import { assignDriverToBus } from "../controllers/admin/Assignment.controllers.js";
import { reassignedDriverToBus } from "../controllers/admin/Reassignment.controllers.js";
const router = express.Router();

// router.post("/signup",signUp);  just for testing purpose, later we will remove this route and create admin directly in database
router.post("/login", loginAdmin);

// Bus routes
router.post("/create-bus", authVerify, createBus);
router.get("/get-bus/:id", authVerify, getBus);
router.get("/buses", authVerify, getAllBuses);

// Driver routes
router.post("/create-driver", authVerify, createDriver);
router.get("/get-driver/:id", authVerify, getDriver);
router.get("/drivers", authVerify, getDrivers);

// Conductor routes
router.post("/create-conductor", authVerify, createConductor);
router.get("/conductor/:id", authVerify, getConductor);
router.get("/conductors", authVerify, getConductors);

// Route routes
router.post("/create-route", authVerify, createRoute);
router.get("/route/:id", authVerify, getRoute);
router.get("/routes", authVerify, getRoutes);

// Assignment routes
router.post("/bus/:busId/assign-driver", authVerify, assignDriverToBus);

// Reassignment routes
router.patch("/bus/:busId/assign-driver", authVerify, reassignedDriverToBus);

export default router;
