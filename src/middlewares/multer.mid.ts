import multer from "multer";
const path = require('path');
//file upload folder

// const storageEngine = multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,DIR)
//     },
//     filename:(req,file,cb)=>{
//         const fileName =  file.originalname.toLocaleLowerCase().split(' ').join('_')
//         cb(null,fileName)
//     },
// });
const storageEngine = multer.diskStorage({       
    filename: function(req, file, cb) {       
      cb(null,new Date().toISOString() + file.originalname);    
    } 
  })

const upload = multer({
    storage:storageEngine,
    fileFilter(req, file, cb) {
        if(file.mimetype=="image/jpeg"||file.mimetype=='image/jpg'||file.mimetype=='image/png') {
            cb(null,true)
        } else {
            cb(null,false)
            return cb(new Error("Only .png, .jpg, .jpeg formats are allowed!!! "))
        }
    },
})

export default upload;

// import multer from 'multer';
// import fs from 'fs';

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const path = './images';
//     fs.mkdirSync(path, { recursive: true });
//     cb(null, path);
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });

// export const upload = multer({ storage: storage });