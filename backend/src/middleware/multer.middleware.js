import multer from "multer";
import path from "path"

const storage = multer.diskStorage({
    filename:(req,file,cb)=>{
        const ext = path.extname(file.originalname|| "").toLowerCase();
        const safeExt = [".jpeg",".jpg",".png",".webp"].includes(ext) ? ext:"";
        const unique =`${Date.now()}-${Math.round(Math.random()*1e9)}`;
        cb(null,`${unique}${safeExt}`);
    },
});

//filefilter:jpeg,jpg,png,webp
const filefilter = (req,file,cb)=>{
    const allowedtypes = /jpeg|jpg|png|webp/
    const extname = allowedtypes.test(path.extname(file.originalname).toLowerCase)
    const mimeType = allowedtypes.test(file.mimeType)

    if(extname && mimeType){
        cb(null,true)
    } else{
        cb(new Error("only image files are allowed (jpeg,jpg,png,webp)"))
    }
};

export const upload = multer({
    storage,
    filefilter,
    limits:{ fileSize: 5 * 1024 * 1024},//SMB LIMIT

});