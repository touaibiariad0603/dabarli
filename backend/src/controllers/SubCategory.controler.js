import { SubCategory } from "../models/SubCategory.model.js";

export async function getSubCategoryById(req,res) {
    try{
        const {id}=req.params;
        const subcategory= await SubCategory.findById(id);

        if(!subcategory) return res.status(404).json({message:" Sub Category not found"});

        res.status(200).json(subcategory);
    }catch(error){
        console.error("Error fetching Sub categoryies",error);
        res.status(500).json({message:"Internal server errror"});
    }
}