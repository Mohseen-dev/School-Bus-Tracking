//! Algorithm for admin login
// 1.get Admin credential from frontend. i.e {email , password} = req.body;
// 2.validate these fields , if empty return ERROR({status:fail,message:"Email and Password are required.",statusCode:400})
// 3.find Admin from DB via findOne, if not found return ERROR({status:fail,message:"Admin not exist ",statusCode:404})
// 4.match password via bcrypt compare method ,if not match return ERROR({status:fail,message:"Invalid Credentail",statusCode:404})
// 5.generate Token via JWT using Admin data i.e { adminId and add role :'Admin '};
// 6.set this token in cookies
// 7.return api Response {status:success,message:"Successfully login as Admin ",Data:findedAdmin (except password),statusCode:200})}

import { Admin } from "../../models/Admin.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiRespone from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and Password are required.");
  }

  const findedAdmin = await Admin.findOne({ email });

  if (!findedAdmin) {
    throw new ApiError(404, "Admin not exist");
  }

  const isPasswordMatch = await findedAdmin.comparePassword(password);
  if (!isPasswordMatch || findedAdmin.role !== "admin" || !findedAdmin.isActive) {
    throw new ApiError(404, "Invalid Credentials");
  }

  const token = await jwt.sign(
    { adminId: findedAdmin._id, role: findedAdmin.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.COOKIE_EXPIRY }
  );

  const cookieOption = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("adminAccessToken", token)
    .json(new ApiResponse(200, findedAdmin, "successfully login and set cookies"));
});



export {loginAdmin}
