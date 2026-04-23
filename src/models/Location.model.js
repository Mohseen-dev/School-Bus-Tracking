import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required:true,
    },
    lat: {
      type: Number,
      required:true,
    },
    lng: {
      type: Number,
      required:true,
    },
    speed: {
      type: Number,
    },
  },
  { timestamps: true }
);

export const Location = mongoose.model("Location", locationSchema);
