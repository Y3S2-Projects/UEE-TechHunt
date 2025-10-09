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
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;
    const savedName = req.file.filename;
    const fileUrl = `/uploads/${savedName}`;

    // Extract text and analyze
    const text = await extractText(filePath);
    const analysis = analyzeText(text);

    // Save to DB
    const cvUpload = await CvUpload.create({
      originalName,
      savedName,
      filePath,
      fileUrl,
      analysis,
    });

    res.status(200).json({
      success: true,
      data: cvUpload,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ success: false, error: "Upload failed" });
  }
};

// GET /api/cv/latest
exports.getLatestCv = async (req, res) => {
  try {
    const latest = await CvUpload.findOne().sort({ uploadedAt: -1 });
    if (!latest) {
      return res.status(200).json({ success: true, data: null });
    }
    res.status(200).json({ success: true, data: latest });
  } catch (err) {
    console.error("Latest CV Error:", err);
    res.status(500).json({ success: false, error: "Failed to get latest CV" });
  }
};


// GET /api/cv/stats
exports.getStats = async (req, res) => {
  try {
    const allUploads = await CvUpload.find().sort({ uploadedAt: -1 });
    const totalUploads = allUploads.length;
    const recentUploads = allUploads.slice(0, 5);

    if (totalUploads === 0) {
      return res.status(200).json({
        uploadsCount: 0,
        avgSkillCount: 0,
        rankDistribution: { level1: 0, level2: 0, topRated: 0 },
        topSkills: [],
        recentUploads: [],
      });
    }

    // --- Calculate stats dynamically ---
    let totalSkills = 0;
    const skillMap = {};
    const rankMap = { level1: 0, level2: 0, topRated: 0 };

    for (const upload of allUploads) {
      const skills = upload.analysis.skills || [];
      const rank = upload.analysis.rank || "Level 1";

      totalSkills += skills.length;

      // Count skill frequencies
      skills.forEach((s) => {
        const skill = s.toLowerCase();
        skillMap[skill] = (skillMap[skill] || 0) + 1;
      });

      // Rank distribution
      if (rank === "Level 1") rankMap.level1++;
      else if (rank === "Level 2") rankMap.level2++;
      else if (rank === "Top Rated") rankMap.topRated++;
    }

    // Top 5 most common skills
    const topSkills = Object.entries(skillMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([skill, count]) => ({ skill, count }));

    const avgSkillCount = totalSkills / totalUploads;

    res.status(200).json({
      uploadsCount: totalUploads,
      avgSkillCount,
      rankDistribution: rankMap,
      topSkills,
      recentUploads,
    });
  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ error: "Failed to get stats" });
  }
};

