import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/admin.routes.js";
import driverRouter from "./routes/driver.routes.js";
import conductorRouter from "./routes/conductor.routes.js";
import parentRouter from "./routes/parent.routes.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use(cookieParser());

app.use("/api/v1/admin/", router);
app.use("/api/v1/driver/", driverRouter);
app.use("/api/v1/conductor/", conductorRouter);
app.use("/api/v1/parent/", parentRouter);

export { app };
