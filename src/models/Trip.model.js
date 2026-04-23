import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    tripType: {
      type: String,
      enum: ["morning", "afternoon"],
      required: true,
      default: "morning",
    },
    status: {
      type: String,
      enum: ["scheduled", "started", "completed", "cancelled"],
      required: true,
      default: "scheduled",
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    conductorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conductor",
      required: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    // expectedStartTime:{},   //how we know epectedStartTime according to tripType
    // expectedEndTime:{},   //how we know epectedEndTime according to tripType
    routeSnapshot: [
      {
        stopName: { type: String, trim: true, lowercase: true },
        lat: { type: Number,  },
        lng: { type: Number, },
        order: { type: Number, },
      },
    ],
    totalStudents: { type: Number,},
    boardedCount: { type: Number, },
  },
  { timestamps: true }
);

export const Trip = mongoose.model("Trip", tripSchema);
