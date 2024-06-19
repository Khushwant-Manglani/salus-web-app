import multer from 'multer';

// Define disk storage for multer
const storage = multer.diskStorage({
  // Destination function defines where to store the uploaded files
  destination: function (req, file, cb) {
    cb(null, './public/temp'); // Store files in './public/temp' directory
  },
  // Filename function defines how to name the uploaded files
  filename: function (req, file, cb) {
    // Generate a unique filename with original name and timestamp suffix
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + '-' + uniqueSuffix);
  },
});

// Initialize multer with defined storage options
export const upload = multer({
  storage, // Use the defined disk storage for file uploads
});
