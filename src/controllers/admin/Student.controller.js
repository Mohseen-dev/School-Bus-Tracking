// Algorithm :--
// 1. get adminId from req.admin (middleware)
// 2. extract input i.e {studentName,rollNumber,grade,dob,parentId,assignedBusId,routeId,pickupLocation}
// 3. validate input and validate parentId is exist or not
// 4. check duplicate {rollNumber}
// 5. generate qrcode 
// 6.create student
// 7. return response

import { Parent } from "../../models/Parent.model.js";
import { Student } from "../../models/Student.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const createStudent = asyncHandler(async(req,res)=>{
    const {adminId} = req.admin._id;
    const {studentName,rollNumber,grade,dob,parentId,assignedBusId,routeId,pickupLocation} = req.body;

    // validate input 
    if(!studentName || !rollNumber || !grade || !dob ||!parentId){
        throw new ApiError(400,"Student name , roll number, grade, dob and parentId are required");
    }

    // check if parentId exists
    const parent = await Parent.findById(parentId);
    if(!parent){
        throw new ApiError(404,"Parent not found");
    }

    // check duplicate
    const isStudentExist = await Student.findOne({rollNumber})
    if(isStudentExist){
        throw new ApiError(409,"Student with this roll number already exists");
    }

    // generate qrcode using roll number , but not I create String not QR code because I am not using any library to generate QR code, I am just creating a string which will be used as QR code in future when we will implement QR code generation and scanning functionality.
    const qrCode = rollNumber;

    // create student
    const newStudent = await Student.create({
        studentName,
        rollNumber,
        grade,
        dob,
        parentId,
        assignedBusId,
        routeId,
        pickupLocation,
        qrCode
    });

    // return response
    return res.status(201).json(new ApiResponse(201,newStudent,"Student created successfully"));
});