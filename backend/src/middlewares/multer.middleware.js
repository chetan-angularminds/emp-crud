import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/temp/files");
  },
  filename: (req, file, cb) => {
    const fileName = req.body.title
      ? req.body.title.replace(/['"\s]+/g, "_")
      : req.body.name
        ? req.body.name.replace(/['"\s]+/g, "_")
        : req.body.fullName ? req.body.fullName.replace(/['"\s]+/g, "_")
          : file.originalname.split(".")[0]+"-"+req.user._id; // Remove quotes and replace spaces with underscores
    console.log(fileName,path.extname(file.originalname) );    
        cb(null, `${fileName}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({ storage });
