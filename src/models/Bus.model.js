import mongoose from "mongoose";

const busSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      unique: true,
      required: true,
      trim:true,
    },
    vehicleNumber: {
      type: String,
      unique: true,
      required: true,
      trim:true,
    },
    capacity: {
        type:Number,
        required:true,
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
    },
    conductorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conductor",
    },
    routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Route",
    },
    isActive: {
        type: Boolean,
        default: true,
        // required:true,
    },
  },
  { timestamps: true }
);

export const Bus = mongoose.model("Bus",busSchema)