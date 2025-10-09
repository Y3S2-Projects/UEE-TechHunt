// test-setup.js
// Run this with: node test-setup.js

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

console.log("========== System Diagnostic ==========\n");

// 1. Check Node version
console.log("1. Node.js Version:");
console.log("   ", process.version);
console.log();

// 2. Check project structure
console.log("2. Project Structure:");
const requiredDirs = ["uploads", "config", "controllers", "models", "middlewares", "routes"];
requiredDirs.forEach(dir => {
  const exists = fs.existsSync(path.join(__dirname, dir));
  console.log(`   ${exists ? "✅" : "❌"} ./${dir}`);
});
console.log();

// 3. Check uploads directory
console.log("3. Uploads Directory:");
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("   ✅ Created uploads directory");
} else {
  console.log("   ✅ Uploads directory exists");
}
const uploadsDirWritable = fs.accessSync(uploadsDir, fs.constants.W_OK) === undefined;
console.log(`   ${uploadsDirWritable ? "✅" : "❌"} Directory is writable`);
console.log("   Path:", uploadsDir);
console.log();

// 4. Check required packages
console.log("4. Required Packages:");
const requiredPackages = [
  "express",
  "mongoose",
  "multer",
  "pdf-parse",
  "mammoth",
  "cors",
  "dotenv"
];

requiredPackages.forEach(pkg => {
  try {
    require.resolve(pkg);
    console.log(`   ✅ ${pkg}`);
  } catch (e) {
    console.log(`   ❌ ${pkg} - NOT INSTALLED`);
  }
});
console.log();

// 5. Check environment variables
console.log("5. Environment Variables:");
console.log("   PORT:", process.env.PORT || "Not set (will use 6000)");
console.log("   MONGO_URI:", process.env.MONGO_URI ? "✅ Set" : "❌ Not set");
console.log();

// 6. Test MongoDB connection
console.log("6. MongoDB Connection Test:");
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log("   ✅ MongoDB connected successfully");
      mongoose.connection.close();
      console.log("\n========================================");
      console.log("All checks completed!");
      console.log("If uploads directory exists and is writable,");
      console.log("and MongoDB connects successfully, you're good to go!");
      console.log("========================================\n");
      process.exit(0);
    })
    .catch(err => {
      console.log("   ❌ MongoDB connection failed");
      console.log("   Error:", err.message);
      console.log("\n========================================");
      console.log("Please fix the MongoDB connection issue!");
      console.log("========================================\n");
      process.exit(1);
    });
} else {
  console.log("   ❌ MONGO_URI not configured in .env file");
  console.log("\n========================================");
  console.log("Please create a .env file with MONGO_URI!");
  console.log("========================================\n");
  process.exit(1);
}