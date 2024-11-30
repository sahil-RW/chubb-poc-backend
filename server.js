const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors'); // Import cors middleware

const app = express();
const PORT = 5000;

// Enable CORS with specific options
const allowedOrigins = [
  'http://localhost:3000', // Local development URL
  'https://chubb-poc.vercel.app/' // Vercel deployment URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      // Allow requests with no origin (e.g., server-to-server requests)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Set up file upload using multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/extract-text', upload.single('claimFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const pdfBuffer = req.file.buffer;

    // Extract text using pdf-parse
    const data = await pdfParse(pdfBuffer);
    const fullText = data.text;
    console.log(fullText)

    res.json({ text: fullText });
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    res.status(500).json({ error: 'Error extracting text from PDF' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
