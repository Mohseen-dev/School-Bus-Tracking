import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required : true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required : true,
    },
    status: {
      type: String,
      enum: ["boarded", "not_boarded", "dropped"],
      default: "not_boarded",
    },
    boardedAt: {
      type: Date,
    },
    droppedAt: {
      type: Date,
    },
    method: {
      type: String,
      enum: ["qr", "manual"],
      default: "qr",
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conductor",
    },
  },
  { timestamps: true }
);

// 🔐 UNIQUE: One student per trip
attendanceSchema.index(
  { tripId: 1, studentId: 1 },
  { unique: true }
);


// ⚡ Optional: Index for faster queries
attendanceSchema.index({ tripId: 1 });
attendanceSchema.index({ studentId: 1 });


export const Attendance = mongoose.model("Attendance", attendanceSchema);
