import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is requried"],
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "password must be greater then 6 character"],
      maxlength: [12, "password must be smaller then 12 character"],
      Select:true
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "subadmin"],
      default: "admin",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


adminSchema.pre("save",async function (next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
        // next();
    }
    // next();
})

adminSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

export const Admin = mongoose.model("Admin",adminSchema)