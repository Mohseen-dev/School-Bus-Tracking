import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    stops: [
      {
        name: { type: String, trim: true, lowercase: true,required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        order: { type: Number, required: true , unique:true},
        expectedTime: { type: Number, required: true },
      },
    ],
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

export const Route = mongoose.model("Route", routeSchema);
