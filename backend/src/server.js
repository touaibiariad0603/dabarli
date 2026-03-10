import express from"express";
import path from "path";
import {ENV}from"./config/env.js";


const app =express();

const _dirname =path.resolve()

app.get("/api/health",(req,res)=>{
    res.status(200).json({Message:"success"});
});
//make our app ready for deployment
if(ENV.NODE_ENV==="production"){
    app.use(express.static(path.join(_dirname,"../admin/dist")))

    app.get("/{*any}",(req,res) =>{
        res.sendFile(path.join(_dirname,"../admin","dist","index.html"));
    } );
}


app.listen(ENV.PORT, () =>console.log("server is up and running"));
