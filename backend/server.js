// I will comment heavily (or at least try to) so that I (or anyone reading this code) in the future will be able to understand anything i did. Should i continue this comment on another line? Maybe yeah.
// This might not be the best code there is out there, but i am sure by the time i end writing this, i will have learned a lot from this project.

const express = require('express')
const dotenv = require('dotenv');
const multer = require('multer');

dotenv.config();

const app = express()
const PORT = process.env.PORT  || 5000;

// CORS - It will allow the Backend to communicate with the frontend.
app.use(cors({
    origin:'https://localhost:3000',
    credentials: true
}))

// Middlewares to parse incoming data. First is for data sent using post requests and second is for form data.
app.use(express.json());
app.use(express.urlencoded({extended: true}))

// Checks if a upload directory exists, if it doesn't, creates one.
const uploadsDir = path.join(__dirname, 'uploads')
if(!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, {recursive: true})
}

// Configures Multer Storage, the destination and filename. Using Date.now() will prevent conflicts and original name can be used to indentify easily what file is being used.
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, uploadsDir)
    },
    filename: (req, file, cb)=>{
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName)
    }
})

// This will filter any files that are not PDFs. Why am i writing a comment for every single function i write...
// Well, i am not very used to writing backend code honestly, especially multer... or anything written in this file.
// I guess that is the reason I'm writing a comment before everything.
const fileFilter = (req, file, cb) => {
    if(file.mimetype == 'application/pdf'){
        cb(null, true);
    } else {
        cb(new Error("Only pdfs are accepted please."), false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits : {
        fileSize : 10 * 1024 * 1024
    }
})

app.post('api/upload', upload.single('pdf'), (req, res)=>{
    try {
        if(!req.file){
            res.json({
                success: false,
                error: "No file uploaded"
            });
        }
    } catch(error){
        console.log("[ERROR] Upload Failed:", error)

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            error: "Failes to process the pdf",
            details: error.message
        })
    }
});

app.listen(PORT, ()=>{
    console.log("Server started...")
})