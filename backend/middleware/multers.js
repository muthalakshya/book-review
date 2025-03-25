// middleware/multers.js
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current file's directory (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define uploads directory with absolute path
const uploadsDir = path.join(__dirname, '..', 'uploads');

// Ensure the directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        // Store uploads in the uploads directory
        callback(null, uploadsDir);
    },
    filename: function(req, file, callback) {
        // Generate unique filename with timestamp and original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        callback(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

// Add file filter to only allow images
const fileFilter = (req, file, callback) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        callback(null, true);
    } else {
        callback(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    // limits: {
    //     fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
    // }
});

export default upload;