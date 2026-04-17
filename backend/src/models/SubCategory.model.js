import mongoose, { mongo } from "mongoose";

const SubCategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category", 
          required: true,
        },
},
{ timestamps: true }
)
export const SubCategory = mongoose.model("SubCategory", SubCategorySchema);