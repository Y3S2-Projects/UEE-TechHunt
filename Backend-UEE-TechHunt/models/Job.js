import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    company: {
      type: String,
      trim: true,
      default: "Anonymous",
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    requirements: {
      type: String,
      maxlength: [1000, "Requirements cannot exceed 1000 characters"],
    },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: [0, "Budget must be positive"],
    },
    duration: {
      type: String,
      default: "Flexible",
    },
    location: {
      type: String,
      default: "Remote",
    },
    category: {
      type: String,
      enum: [
        "Development",
        "Design",
        "Writing",
        "Marketing",
        "Video & Animation",
        "Music & Audio",
      ],
      default: "Development",
    },
    skills: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "closed", "in-progress"],
      default: "active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    bids: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        amount: Number,
        message: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ title: "text", description: "text", company: "text" });

export default mongoose.model("Job", jobSchema);