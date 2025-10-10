// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const connectDB = require("./config/connectDB");
const cvRoutes = require("./routes/cvRoutes");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Create uploads directory if it doesn't exist
const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log("✅ Created uploads directory:", UPLOADS_DIR);
} else {
  console.log("✅ Uploads directory exists:", UPLOADS_DIR);
}

// Static folder for uploads
app.use("/uploads", express.static(UPLOADS_DIR));

// API routes
app.use("/api/cv", cvRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "CV Analysis API Server",
    endpoints: {
      upload: "POST /api/cv/upload",
      latest: "GET /api/cv/latest",
      stats: "GET /api/cv/stats"
    }
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uploadsDir: UPLOADS_DIR,
    uploadsDirExists: fs.existsSync(UPLOADS_DIR)
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    success: false,
    error: err.message || "Internal server error"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found"
  });
});

const PORT = process.env.PORT || 6000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("=========================================");
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
  console.log(`📁 Uploads directory: ${UPLOADS_DIR}`);
  console.log(`🔗 MongoDB: ${process.env.MONGO_URI ? 'Configured' : 'NOT CONFIGURED'}`);
  console.log("=========================================");
});