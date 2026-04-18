import { Category } from "../models/category.model.js";

export async function getCategoryById(req,res) {
    try{
        const {id}=req.params;
        const category = await Category.findById(id);

        if(!category) return res.status(404).json({message:"Category not found"});

        res.status(200).json(category);
    }catch(error){
        console.error("Error fetching categories",error);
        res.status(500).json({message:"Internal server errror"});
    }
}