import express from "express";
import {
  getMe,
  updateOnboarding,
  uploadAvatar,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/me", protect, getMe);
router.put("/onboard", protect, updateOnboarding);
router.post("/avatar", protect, upload.single("avatar"), uploadAvatar);

export default router;
