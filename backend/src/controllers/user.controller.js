
import {user} from"../models/user.model.js";

//addresses function
export async function addAddress(req,res) {
    try{
        const{label,fullName,streetAddress,city,state,zipCode,phoneNumber,isDefault}=
        req.body;
        const user = req.user;

        if(!fullName||!streetAddress||!city||!state||!zipCode||!phoneNumber){
            return res.status(400).json({error:"Missing required address fields"});
        }

        //if this is set as default, unset all other defaults
        if(isDefault){
            user.addAddress.array.forEach((addr) => {
                addr.isDefault = false;
            });
        }
        user.addAddress.push({
            label,
            fullName,
            streetAddress,
            city,
            state,
            zipCode,
            phoneNumber,
            isDefault:isDefault || false
        })
        await user.save()

        res.status(201).json({message:"Address added successfully",addresses:user.addAddress})
    }catch(error){
        console.error("Eroor in addAddress controller",error);
        res.status(500).json({error:"Internal server error"});


    }
};

export async function getAddresses(req,res) {
    try{
        const user = req.user

        res.status(200).json({addresses: user.addresses});

    }catch(error){
        console.error("Eroor in getAddresses controller",error);
        res.status(500).json({error:"Internal server error"});
    }
};

export async function updateAddress(req,res) {
    try{
       const{label,fullName,streetAddress,city,state,zipCode,phoneNumber,isDefault}=
        req.body;

        const {addressId}= req.params

        const user = req.user
        const address = user.addresses.id(addressId);
        if(!address){
            return res.status(404).json({error:"Address not found"});
        }
        //if this is set as default, unset all other defaults
        if(isDefault){
            user.addAddress.array.forEach((addr) => {
                addr.isDefault = false;
            });
        }

        address.label=label || address.label
        address.fullName=fullName || address.fullName
        address.streetAddress=streetAddress || address.streetAddress
        address.city=city || address.city
        address.state=state || address.state
        address.zipCode=zipCode || address.zipCode
        address.phoneNumber=phoneNumber || address.phoneNumber
        address.isDefault=isDefault!==undefined ? isDefault: address.isDefault

        await user.save()

        res.status(200).json({message:"Address update successfuly",addresses:user.addresses});
        
    }catch(error){
        console.error("Eroor in updateAddress controller",error);
        res.status(500).json({error:"Internal server error"});
    }
};

export async function deleteAddress(req,res) {
    try{
    const {addressId} = req.params;
    const user = req.user;

    user.addresses.pull(addressId);
    await user.save();

     res.status(200).json({message:"Address deleted successfuly",addresses:user.addresses});
}catch(error){
        console.error("Eroor in deleteAddress controller",error);
        res.status(500).json({error:"Internal server error"});
};

};


//wishlist function
export async function addToWishlist(req,res) {
    try {
        const {productId} =req.body;
        const user = req.user

        //check if product is already in wishlist
        if(user.wishlist.includes(productId)){
            return res.status(400).json({error:"product already in wishlist",wishlist:user.wishlist});
        }
        
        user.wishlist.push(productId);
        await user.save();
        res.status(200).json({message:"product added to wishlist",wishlist:user.wishlist});
    } catch (error) {
        console.error("Eroor in addToWishlist controller",error);
        res.status(500).json({error:"Internal server error"});
    }
};

export async function removeFromWishlist(req,res) {
    try {
        const {productId}=req.params;
        const user=req.user;

        if(!user.wishlist.includes(productId)){
        return res.status(400).json({error:"product not found in wishlist",wishlist:user.wishlist});
        }


        user.wishlist.pull(productId);
        await user.save;

        res.status(200).json({message:"product deleted from wishlist",wishlist:user.wishlist})
    } catch (error) {
        console.error("Eroor in removeFromWishlist controller",error);
        res.status(500).json({error:"Internal server error"});
    }
};

export async function getWishlist(req,res) {
    try {

        //we're using populate , bc wislist is just an array of products ids
        const user= await user.findById(req.user._id).populate("wishlist");
        res.status(200).json({wishlist: user.wishlist});
    } catch (error) {
        console.error("Eroor in getWishlist controller",error);
        res.status(500).json({error:"Internal server error"});
    }
};
