import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    StudentName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    roll: {
      type: String,
      required: true,
      unique: true,
    },
    class: {
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
    },
    assignedBusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
    },
    qrCode: {
      type: String,
      // required:true,
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
