// Algorithm
// 1. get Conductor details from req.body  { email , password} ;
// 2. validate input
// 3.find Conductor from database
// 4. if not found -> return ERROR
// 5. compare password (already define method in model of conductor see in conductor.model.js file);
// 6. if password mismatch -> ERROR;
// 7. get jwt token with conductorId and maybe add role as conductor
// 8. return response with token and conductor detail except password , so first remove password from database's response;

import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { Conductor } from "../../models/Conductor.model.js";
import jwt from "jsonwebtoken";
import ApiResponse from "../../utils/ApiResponse.js";

export const loginConductor = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new ApiError(400, "Email and Password is required");

  // find Conductor
  const conductor = await Conductor.findOne({ email }).select("+password");
  if (!conductor) throw new ApiError(404, "Conductor not found");

  // console.log("this is conductor detial from database : ", conductor);

  //   password matching

  const isPasswordCorrect = await conductor.comparePassword(password);
  if (!isPasswordCorrect) throw new ApiError(401, "Invalid credentials");

  // generate JWT token
  const token = await jwt.sign(
    {
      conductorId: conductor._id,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.COOKIE_EXPIRY }
  );

  const cookieOption = {
    httpOnly: true,
    secure: true,
  };

  // console.log(token);
  // console.log("Conductor before deleting password : ", conductor);

  // delete password
  const conductorData = conductor.toObject();
  delete conductorData.password;

  // console.log("Conductor after deleting password : ", conductorData);

  res
    .status(200)
    .cookie("conductorAccessToken", token)
    .json(
      new ApiResponse(
        200,
        conductorData,
        "successfully Conductor login and set cookies"
      )
    );
});
