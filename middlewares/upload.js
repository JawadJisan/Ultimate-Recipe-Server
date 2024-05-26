import multer from "multer";

// Setup multer for storing uploaded files
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
