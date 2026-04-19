import mongoose, { mongo } from "mongoose";
import { Product } from "./product.model.js";
import { types } from "inngest/internals";

const orderItemSchema = new mongoose.Schema({
    Product:{
    type:mongoose.Schema.ObjectId,
    ref:"Product",
    required:true,
},
name:{
    type:String,
    required:true
},
price:{
    type:Number,
    required:true,
    min:0
},
quantity:{
    type:Number,
    required:true,
    min:1
},
image:{
    type:String,
    required:true,
}
});

const shippingAddressSchema = new mongoose.Schema({
  fullName:      { type: String, required: true },
  streetAddress: { type: String, required: true }, 
  city:          { type: String, required: true },
  state:         { type: String, required: true },
  zipCode:       { type: String, required: true },
  phoneNumber:   { type: String, required: true },
});
const orderSchema = new mongoose.Schema({
user:{
    type:mongoose.Schema.ObjectId,
    ref:"user",
    required:true,
},
clerkId:{
    type:String,
    required:true,
},
orderItems:[orderItemSchema],
shippingAddress: { type: shippingAddressSchema, required: true },
paymentResult: {
    id:String,
    status:String,
},
totalPrice:{
    type:Number,
    required:true,
    min:0
},
status:{
    type:String,
    enum:["pending","shipped","delicered"],
    default:"pending"
},
deliveredAt:{
    type:Date
},
shippedAt:{
    type:Date
},

},{timestamps:true})

export const Order = mongoose.model("order",orderSchema);