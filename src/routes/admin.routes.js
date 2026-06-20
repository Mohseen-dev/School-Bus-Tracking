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
} from "../controllers/admin/Route.controller.js";
import { assignConductorToBus, assignDriverToBus, assignedRouteToBus, assignStudentToBus } from "../controllers/admin/Assignment.Controller.js";
import { reassignedConductorToBus, reassignedDriverToBus, reassignedRouteToBus, reassignedStudentToBus } from "../controllers/admin/Reassignment.controller.js";
import { createParent } from "../controllers/admin/Parent.controller.js";
import { createStudent } from "../controllers/admin/Student.controller.js";





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

// Parent routes
router.post("/parent/create-parent",authVerify,createParent);

// Student routes
router.post("/student/create-student",authVerify,createStudent)

// Assignment routes
  // Assign Driver to Bus
  router.post("/bus/:busId/assign-driver", authVerify, assignDriverToBus);

  // Assign Conductor to Bus 
  router.post("/bus/:busId/assign-conductor",authVerify,assignConductorToBus); 

  // Assign Route to Bus 
  router.post("/bus/:busId/assign-route",authVerify,assignedRouteToBus);

  // Assign Student to Bus
  router.post("/student/:studentId/assign-bus",authVerify,assignStudentToBus);


// Reassignment routes
  // Reassign Driver to Bus
  router.patch("/bus/:busId/assign-driver", authVerify, reassignedDriverToBus);
  // Reassign Conductor to Bus
  router.patch("/bus/:busId/assign-conductor",authVerify,reassignedConductorToBus);

  // Reassign Route to Bus 
  router.patch("/bus/:busId/assign-route",authVerify,reassignedRouteToBus);

  // Reassign Route to Bus 
  router.patch("/bus/:busId/assign-route",authVerify,reassignedRouteToBus);

  // Reassign Student to Bus
  router.patch("/student/:studentId/assign-bus",authVerify,reassignedStudentToBus);


export default router;
