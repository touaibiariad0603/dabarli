import mongoose from "mongoose"
import { user } from "./user.model"
const cartItemSchema = new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product",
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
        min:1,
        default:1,
    }
});

const cartSchema =new mongoose.Schema({
    user:{
        type:mongoose.Schema.type.ObjectId,
        ref:"user",
    },
    clerkId:{
        type:String,
        required:true,
        unique:true,
    },
    items: [cartItemSchema]

},{timeseries:true});

export const Cart = mongoose.model("cart",cartSchema);