import express from "express";
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  submitBid,
} from "../controllers/jobController.js";

const router = express.Router();

// Public routes
router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/", createJob);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);
router.post("/:id/bid", submitBid);

export default router;