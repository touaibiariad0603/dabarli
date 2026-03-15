import {Inngest} from "inngest";
import {connectDB} from './db.js'
import { user } from "../models/user.model.js";

export const  inngest = new Inngest({id:"dabarli-app"})

const syncUser=inngest.createFunction(
    {id:"sync-user"},
    {event:"clerk/user.created"},
    async({event})=>{
        await connectDB();
        const {id,email_addresses,first_name,last_name,image_url}=event.data
        
        const newUser={
            clerkID: id,
            email: email_addresses[0]?.email_addresses,
            name:`${first_name ||""}${last_name || ""}` || user,
            imageurl: image_url,
            addresses:[],
            whishlist:[]
        };

        await user.create(newUser);

    }

);

const deleteUserFromDB = inngest.createFunction(
    {id:"delete-user-from-dv"},
    {event:"clerk/user.deleted"},
    async ({event})=>{
        await connectDB();

        const{id}=event.data;
        await user.deletOne({clerkID:id});
    }
);


export const functions = [syncUser,deleteUserFromDB]
    
