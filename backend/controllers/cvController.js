// controllers/cvController.js
const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const CvUpload = require("../models/CvUpload");

const SKILLS = [
  "javascript", "react", "react native", "node", "express", "mongodb", "sql", "typescript",
  "java", "python", "c#", "c++", "html", "css", "aws", "docker", "kubernetes", "git",
  "graphql", "rest", "redux", "firebase", "php", ".net", "spring boot", "django", "flask",
  "angular", "vue", "nextjs", "nuxt", "tailwind", "sass", "bootstrap", "jquery",
  "webpack", "babel", "jest", "mocha", "jenkins", "ci/cd", "agile", "scrum"
];

// Extract text from uploaded file
async function extractText(filePath) {
  console.log("Extracting text from:", filePath);
  
  if (!fs.existsSync(filePath)) {
    console.error("File does not exist:", filePath);
    throw new Error("File not found");
  }

  const ext = path.extname(filePath).toLowerCase();
  console.log("File extension:", ext);

  try {
    if (ext === ".pdf") {
      const data = fs.readFileSync(filePath);
      console.log("PDF file size:", data.length, "bytes");
      const parsed = await pdfParse(data);
      console.log("Extracted text length:", parsed.text.length);
      return parsed.text || "";
    }

    if (ext === ".docx" || ext === ".doc") {
      const result = await mammoth.extractRawText({ path: filePath });
      console.log("DOCX text length:", result.value.length);
      return result.value || "";
    }

    // Fallback for text files
    const text = fs.readFileSync(filePath, "utf8");
    console.log("Text file length:", text.length);
    return text;
  } catch (error) {
    console.error("Text extraction error:", error);
    throw error;
  }
}

// Analyze CV text and assign rank
function analyzeText(text) {
  if (!text || text.trim().length === 0) {
    console.log("Warning: Empty text provided for analysis");
    return { skills: [], score: 0, rank: "Level 1" };
  }

  const lower = text.toLowerCase();
  const foundSkills = new Set();

  // Find matching skills
  for (const skill of SKILLS) {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(text)) {
      foundSkills.add(skill);
    }
  }

  // Calculate score
  let score = foundSkills.size * 10;

  // Bonus for seniority level
  if (/(senior|lead|expert|principal|architect)/i.test(text)) {
    score += 20;
  }

  // Bonus for years of experience
  const yrsMatch = text.match(/(\d+)\s*\+?\s*years?/i);
  if (yrsMatch) {
    const years = parseInt(yrsMatch[1], 10);
    score += Math.min(years * 5, 50);
  }

  // Bonus for certifications
  if (/(certified|certification|certificate)/i.test(text)) {
    score += 10;
  }

  // Bonus for education
  if (/(bachelor|master|phd|degree)/i.test(text)) {
    score += 10;
  }

  // Determine rank based on score
  let rank = "Level 1";
  if (score >= 60 && score < 110) {
    rank = "Level 2";
  } else if (score >= 110) {
    rank = "Top Rated";
  }

  console.log(`Analysis complete - Skills: ${foundSkills.size}, Score: ${score}, Rank: ${rank}`);

  return {
    skills: Array.from(foundSkills).sort(),
    score,
    rank
  };
}

// POST /api/cv/upload
exports.uploadCv = async (req, res) => {
  console.log("========== CV Upload Request ==========");
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);
  
  try {
    // Check if file was uploaded
    if (!req.file) {
      console.error("No file in request");
      return res.status(400).json({
        success: false,
        error: "No file uploaded. Please select a PDF or DOCX file."
      });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;
    const savedName = req.file.filename;
    const fileUrl = `/uploads/${savedName}`;

    console.log("File details:");
    console.log("  - Original name:", originalName);
    console.log("  - Saved name:", savedName);
    console.log("  - File path:", filePath);
    console.log("  - File size:", req.file.size);

    // Verify file exists
    if (!fs.existsSync(filePath)) {
      console.error("File was not saved to disk:", filePath);
      return res.status(500).json({
        success: false,
        error: "File upload failed - file not saved"
      });
    }

    // Extract text from CV
    console.log("Starting text extraction...");
    const text = await extractText(filePath);
    
    if (!text || text.trim().length === 0) {
      console.error("No text extracted from file");
      return res.status(400).json({
        success: false,
        error: "Could not extract text from CV. Please ensure the file is readable."
      });
    }

    console.log("Text extracted successfully, length:", text.length);

    // Analyze the CV
    console.log("Starting CV analysis...");
    const analysis = analyzeText(text);
    
    console.log("Analysis result:", JSON.stringify(analysis, null, 2));

    // Save to database
    console.log("Saving to database...");
    const cvUpload = await CvUpload.create({
      originalName,
      savedName,
      filePath,
      fileUrl,
      analysis,
    });

    console.log("CV saved successfully, ID:", cvUpload._id);
    console.log("========================================");

    // Return success response
    res.status(200).json({
      success: true,
      message: "CV uploaded and analyzed successfully",
      data: cvUpload,
    });

  } catch (err) {
    console.error("========== Upload Error ==========");
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    console.error("===================================");
    
    // Clean up uploaded file if there's an error
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
        console.log("Cleaned up failed upload file");
      } catch (unlinkErr) {
        console.error("Error deleting file:", unlinkErr);
      }
    }
    
    res.status(500).json({
      success: false,
      error: err.message || "Failed to process CV. Please try again."
    });
  }
};

// GET /api/cv/latest
exports.getLatestCv = async (req, res) => {
  console.log("Getting latest CV...");
  try {
    const latest = await CvUpload.findOne().sort({ uploadedAt: -1 });
    
    if (!latest) {
      console.log("No CV found in database");
      return res.status(200).json({
        success: true,
        data: null,
        message: "No CV found. Please upload a CV first."
      });
    }

    console.log("Latest CV found:", latest._id);
    res.status(200).json({
      success: true,
      data: latest
    });

  } catch (err) {
    console.error("Latest CV Error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve latest CV"
    });
  }
};

// GET /api/cv/stats
exports.getStats = async (req, res) => {
  console.log("Getting CV stats...");
  try {
    const allUploads = await CvUpload.find().sort({ uploadedAt: -1 });
    const totalUploads = allUploads.length;
    console.log("Total uploads in database:", totalUploads);

    const recentUploads = allUploads.slice(0, 5);

    // Return empty stats if no uploads
    if (totalUploads === 0) {
      console.log("No uploads found, returning empty stats");
      return res.status(200).json({
        uploadsCount: 0,
        avgSkillCount: 0,
        rankDistribution: { level1: 0, level2: 0, topRated: 0 },
        topSkills: [],
        recentUploads: [],
      });
    }

    // Calculate statistics
    let totalSkills = 0;
    const skillMap = {};
    const rankMap = { level1: 0, level2: 0, topRated: 0 };

    for (const upload of allUploads) {
      const skills = upload.analysis?.skills || [];
      const rank = upload.analysis?.rank || "Level 1";

      totalSkills += skills.length;

      // Count skill frequencies
      skills.forEach((skill) => {
        const skillLower = skill.toLowerCase();
        skillMap[skillLower] = (skillMap[skillLower] || 0) + 1;
      });

      // Count rank distribution
      if (rank === "Level 1") {
        rankMap.level1++;
      } else if (rank === "Level 2") {
        rankMap.level2++;
      } else if (rank === "Top Rated") {
        rankMap.topRated++;
      }
    }

    // Get top 5 most common skills
    const topSkills = Object.entries(skillMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([skill, count]) => ({ skill, count }));

    const avgSkillCount = totalSkills / totalUploads;

    const stats = {
      uploadsCount: totalUploads,
      avgSkillCount: parseFloat(avgSkillCount.toFixed(2)),
      rankDistribution: rankMap,
      topSkills,
      recentUploads,
    };

    console.log("Stats calculated successfully");
    res.status(200).json(stats);

  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve statistics"
    });
  }
};