import Router from "express";
import {signUp} from "../controllers/admin/signUp.controller.js";
import {loginAdmin} from "../controllers/admin/login.controller.js";
import {authVerify} from '../Middlewares/admin/authVerify.js'
import {createBus} from '../controllers/admin/Bus.controller.js'
import { createDriver } from "../controllers/admin/Driver.controller.js";
const router = Router();

// router.post("/signup",signUp);  just for testing purpose, later we will remove this route and create admin directly in database
router.post("/login",loginAdmin)

router.post('/create-bus',authVerify,createBus)

router.post("/create-driver",authVerify,createDriver);

export default router