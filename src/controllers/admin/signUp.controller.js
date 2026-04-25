import asyncHandler from "../../utils/asyncHandler.js"
import ApiError from '../../utils/ApiError.js'
import { Admin } from "../../models/Admin.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
export const signUp = asyncHandler(async (req,res)=>{
    const {email,password,name} = req.body;

    // check if email and password is provided or not
    if(!email || !password){
        throw new ApiError(400,"Email and password is required")
    }

    const admin = await Admin.findOne({email});
    if(admin){
        throw new ApiError(404,"Admin is already exist with this emmail ");
    }
    const newAdmin = await Admin.create({
        name,
        email,
        password
    })

    if(!newAdmin){
        throw new ApiError(500,"failed to create admin");
        
    }
    const adminData = newAdmin.toObject();
    delete adminData.password;
    return res.status(201).json(
        new ApiResponse(201,adminData,"Admin created successfully")
    )


})