import { requireAuth } from "@clerk/express";
import {user } from "../models/user.model.js";
import { ENV } from "../config/env.js";

export const protectRoute=[
    requireAuth(),
    async (req,res,next)=>{
        try{
            const clerkId = req.auth().userId
            if(!clerkId) return res.status(401).json({message:"unauthorized - invalid token"});

            const dbuser = await user.findOne({clerkId})
            if(!dbuser) return res.status(404).json({message:"user not found"});
            
            req.user=dbuser     
            
            next()
                
        }catch(error){
            console.error("error in protectRoute middleware",error);
            res.status(500).json({message:"internal sercer error"});
            

        }
    },

];

export const adminOnly=(req,res,next)=>{
    if(!req.user){
        return res.status(401).json({message:"Unauthorized - user not found"})
    }

    if (req.user.email !==ENV.ADMIN_EMAIL){
        return res.status(403).json({message:'Forbidden - admin acces only'})
    }
    
    next();
}   