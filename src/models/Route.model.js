import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true
    
    },
    stops:[
        {
            name:{type:String,trim:true,lowercase:true},
            lat:{type:Number},
            lng:{type:Number},
            order:{type:Number},
            expectedTime:{type:Number}
        }
    ],
    isActive:{type:Boolean,required:true,default:true}
},{timestamps:true});

export const Route = mongoose.model("Route",routeSchema)