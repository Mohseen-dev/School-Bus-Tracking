import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const parentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        select:false,
        minlength:[6,"Length of password must be greater than 6"],
        maxlength:[12,"Length of password must be smaller than 12"],
    },
    phone:{
        type:String,
        trim:true
    },
    children:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Student"

        }
    ]
},{timestamps:true});

parentSchema.pre("save",async function(next){
    if (!this.isModified("password")) {
        return next();
      }
      this.password = await bcrypt.hash(this.password, 10);
      next();
})

parentSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

export const Parent = mongoose.model("Parent",parentSchema)