const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 8081;

// Backend controllers
const authController = require('./Controllers/AuthController');
const adminController = require('./Controllers/AdminController');
const patientController = require('./Controllers/PatientController');

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve frontend dependencies
app.use('/assets', express.static(path.join(__dirname, 'src/assets')));
app.use('/components', express.static(path.join(__dirname, 'src/components')));
app.use('/pages', express.static(path.join(__dirname, 'src/pages')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// ✅ Serve homepage (root index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/test', (req, res) => {
    res.json({ message: "✅ Backend is working fine!" });
});
  

// API routes
app.use('/auth', authController);
app.use('/admin', adminController);
app.use('/patient', patientController);

// Optional: fallback for undefined routes
app.use((req, res) => {
  res.status(404).send('404 - Page Not Found');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
