import express from"express";
const app =express();

app.get("/api/health",(req,res)=>{
    res.status(200).json({Message:"success"});
});

app.listen(3000, () =>console.log("server is up and running"));
