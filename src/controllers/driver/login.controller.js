// Algorithm

// 1. get Driver details from req.body {email,password} ;
// 2. validate input
// 3. find driver by email
// 4. if driver not found → ERROR(404, "Driver not found")
// 5. compare password using bcrypt
// 6. if password mismatch -> ERROR(401,"Invalid credentials");
// 7. generate JWT token with driverId and role
// 8. return response with token and driver details

import { Driver } from "../../models/Driver.model.js";
import ApiError from "../../utils/ApiError.js";
import jwt from "jsonwebtoken";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const driverLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // validate input
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // find driver by email
  const driver = await Driver.findOne({ email });
  if (!driver) {
    throw new ApiError(404, "Driver not found");
  }
  // console.log("Driver detail from login contoller : ",driver);
  // compare password
  const isPasswordCorrect = await driver.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  // generate JWT token
  const token = await jwt.sign(
    { driverId: driver._id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.COOKIE_EXPIRY,
    }
  );

  const cookieOption = {
    httpOnly: true,
    secure: true,
  };

  // console.log("Driver data  before deleting password: ",driver);

  const driverData = driver.toObject();
  delete driverData.password;

  // console.log("Driver data after deleting password : ", driverData);

  res
    .status(200)
    .cookie("driverAccessToken", token)
    .json(
      new ApiResponse(
        200,
        driverData,
        "successfully Driver login and set cookies"
      )
    );
});
