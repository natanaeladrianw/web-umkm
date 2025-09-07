const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes
app.get('/api/umkm', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/umkm-data.json'), 'utf8'));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load data' });
  }
});

app.get('/api/products', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/umkm-data.json'), 'utf8'));
    res.json(data.umkm.products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load products' });
  }
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  // Simulasi penyimpanan pesan (dalam real application, simpan ke database)
  console.log('Pesan baru:', { name, email, message, timestamp: new Date().toISOString() });
  
  res.json({ 
    success: true, 
    message: 'Pesan Anda telah terkirim! Kami akan menghubungi Anda segera.' 
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});