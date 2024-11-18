const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// CORS 설정 (필요한 경우만)
app.use(cors());

// Multer 설정: 업로드할 파일의 저장 위치와 이름을 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 파일을 저장할 폴더
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 고유한 파일명
  }
});

const upload = multer({ storage: storage });

// 이미지 업로드 API
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  
  // 업로드된 파일의 URL 반환
  const fileUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
  res.json({ fileUrl });
});

// 이미지 파일 서빙
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'your-cloud-name',
  api_key: 'your-api-key',
  api_secret: 'your-api-secret'
});

app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  
  try {
    // Cloudinary로 이미지 업로드
    const result = await cloudinary.uploader.upload(req.file.path);
    res.json({ fileUrl: result.secure_url });
  } catch (error) {
    res.status(500).send('Image upload failed.');
  }
});
