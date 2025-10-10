// routes/cvRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const { uploadCv, getStats } = require("../controllers/cvController");
const { getLatestCv } = require("../controllers/cvController");

router.post("/upload", upload.single("cv"), uploadCv);
router.get("/stats", getStats);
router.get("/latest", getLatestCv);

module.exports = router;



