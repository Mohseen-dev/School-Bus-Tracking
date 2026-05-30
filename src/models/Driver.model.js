import mongoose from "mongoose";
import bcrypt from "bcrypt";

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Length of password  must be greater than 6"],
      maxlength: [12, "Length of password  must be smaller than 12"],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    licenseNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    licenseExpiry: {
      type: Date,
      required: true,
    },
    assignedBusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true }
);

driverSchema.pre("save", async function(next) {

   try {

      const password = this.password;

      if (!this.isModified("password")) {
         return next();
      }

      if (!password) {
         return next(new Error("Password is undefined before hashing"));
      }

      const hashedPassword = await bcrypt.hash(String(password), 10);

      this.password = hashedPassword;

      next();

   } catch (error) {
      console.log("HOOK ERROR:", error);
      next(error);
   }
});
driverSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const Driver = mongoose.model("Driver", driverSchema);
