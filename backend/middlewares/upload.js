import multer from 'multer';

const storage = multer.memoryStorage(); // buffer stored in memory
const upload = multer({ storage });

export default upload;
