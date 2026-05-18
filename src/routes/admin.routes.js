import Router from "express";
import {signUp} from "../controllers/admin/signUp.controller.js";
import {loginAdmin} from "../controllers/admin/login.controller.js";
import {authVerify} from '../Middlewares/admin/authVerify.js'
import {createBus, getAllBuses, getBus} from '../controllers/admin/Bus.controller.js'
import { createDriver, getDriver, getDrivers } from "../controllers/admin/Driver.controller.js";
import { createConductor, getConductor, getConductors } from "../controllers/admin/Conductor.controller.js";
const router = Router();

// router.post("/signup",signUp);  just for testing purpose, later we will remove this route and create admin directly in database
router.post("/login",loginAdmin)

router.post('/create-bus',authVerify,createBus)
router.get("/get-bus/:id",authVerify,getBus);
router.get("/buses",authVerify,getAllBuses);

router.post("/create-driver",authVerify,createDriver);
router.get("/get-driver/:id",authVerify,getDriver);
router.get("/drivers",authVerify,getDrivers);

router.post("/create-conductor",authVerify,createConductor);
router.get("/conductor/:id",authVerify,getConductor);
router.get("/conductors",authVerify,getConductors);

export default router