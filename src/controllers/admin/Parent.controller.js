// Algorithm :---
// 1. get adminId from req.admin (middleware)
// 2. extract input i.e {name,email,phone,password}
// 3. validate input
// 4. check duplicate (email,phone)
// 5.hash password
// 6.create parent
// 7.return response

import { Parent } from "../../models/Parent.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";


export const createParent = asyncHandler(async (req,res)=>{
    const adminId = req.admin._id;
    const {name,email,phone,password} = req.body;


    // validate input
    if(!name || !email || !password){
        throw new ApiError(400,"Name, email and password are required");
    }

    // check duplicate
    const isParentExist = await Parent.findOne({email});

    if(isParentExist){
        throw new ApiError(400,"Parent already exists");
    }

    // create parent
    const newParent = await Parent.create({name,email,phone,password});

    res.status(201).json(new ApiResponse(201,newParent,"Parent created successfully"));


})