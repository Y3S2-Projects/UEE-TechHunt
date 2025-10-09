// controllers/cvController.js
const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const CvUpload = require("../models/CvUpload");

const SKILLS = [
  "javascript","react","react native","node","express","mongodb","sql","typescript",
  "java","python","c#","c++","html","css","aws","docker","kubernetes","git",
  "graphql","rest","redux","firebase","php",".net","spring boot","django","flask",
  "angular","vue","nextjs","nuxt","tailwind"
];

// Extract text
async function extractText(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".pdf") {
    const data = fs.readFileSync(filePath);
    const parsed = await pdfParse(data);
    return parsed.text || "";
  }

  if (ext === ".docx" || ext === ".doc") {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value || "";
    } catch {
      return "";
    }
  }

  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

// Analyze text and rank
function analyzeText(text) {
  const lower = text.toLowerCase();
  const foundSkills = new Set();

  for (const s of SKILLS) {
    if (lower.includes(s)) foundSkills.add(s);
  }

  let score = foundSkills.size * 10;
  if (/(senior|lead|expert|principal)/i.test(text)) score += 15;
  const yrsMatch = text.match(/(\d+)\s+years?/i);
  if (yrsMatch) score += Math.min(parseInt(yrsMatch[1], 10) * 5, 50);

  let rank = "Level 1";
  if (score >= 60 && score < 110) rank = "Level 2";
  if (score >= 110) rank = "Top Rated";

  return { skills: [...foundSkills], score, rank };
}

// POST /api/cv/upload
exports.uploadCv = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;
    const text = await extractText(filePath);
    const analysis = analyzeText(text);

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const cv = new CvUpload({
      originalName: req.file.originalname,
      savedName: req.file.filename,
      filePath,
      fileUrl,
      analysis,
    });
    await cv.save();

    res.status(200).json({
      success: true,
      message: "CV uploaded successfully",
      data: cv,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
};

// GET /api/cv/stats
exports.getStats = async (req, res) => {
  try {
    const count = await CvUpload.countDocuments();
    const recentUploads = await CvUpload.find().sort({ uploadedAt: -1 }).limit(5);

    const stats = {
      projects: 12,
      earnings: 1500,
      completedCourses: 8,
      uploadsCount: count,
      recentUploads,
    };

    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ error: "Failed to get stats" });
  }
};
