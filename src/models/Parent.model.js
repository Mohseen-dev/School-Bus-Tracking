import mongoose from "mongoose";
import bcrypt from "bcrypt";

const parentSchema = new mongoose.Schema(
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
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
      minlength: [6, "Length of password must be greater than 6"],
      maxlength: [12, "Length of password must be smaller than 12"],
    },
    phone: {
      type: String,
      trim: true,
    },
    // create some error in the below code if we use children array in parent schema because when i create a parent and then create a student and assign the parent to the student then the parent will not have the student in the children array because we are not pushing the student id to the parent schema so we need to create a separate endpoint to add the student id to the parent schema when we create a student and assign the parent to the student. so we can remove the children array from the parent schema and create a separate endpoint to add the student id to the parent schema when we create a student and assign the parent to the student.
    // children:[
    //     {
    //         type:mongoose.Schema.Types.ObjectId,
    //         ref:"Student"

    //     }
    // ]
  },
  { timestamps: true }
);

parentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
//   next();
});

parentSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const Parent = mongoose.model("Parent", parentSchema);
