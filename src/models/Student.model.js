import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    rollNumber: {
      type: String,
      required: true,
      unique: true,
    },
    grade: {
      type: Number,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
      required:true
    },
    assignedBusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
    },
    // routeId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Route",
    // },
    qrCode: {
      type: String,
      required:true,
    },
    pickupLocation: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String },
    },
  },
  { timestamps: true }
);

export const Student = mongoose.model("Student", studentSchema);
