import Job from "../models/Job.js";

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const { category, search, sort = "-createdAt" } = req.query;

    let query = { status: "active" };

    // Filter by category
    if (category && category !== "All") {
      query.category = category;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    const jobs = await Job.find(query).sort(sort).lean();

    res.json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job",
      error: error.message,
    });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Public
export const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      requirements,
      budget,
      duration,
      location,
      category,
      skills,
      image,
    } = req.body;

    // Validation
    if (!title || !description || !budget) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, description, and budget",
      });
    }

    const jobData = {
      title: title.trim(),
      company: company?.trim() || "Anonymous",
      description: description.trim(),
      requirements: requirements?.trim() || "",
      budget: Number(budget),
      duration: duration || "Flexible",
      location: location || "Remote",
      category: category || "Development",
      skills: Array.isArray(skills) ? skills : [],
      image: image || null,
    };

    const job = await Job.create(jobData);

    console.log("✅ Job created:", job._id);

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      data: job,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(400).json({
      success: false,
      message: "Failed to create job",
      error: error.message,
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Public
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(400).json({
      success: false,
      message: "Failed to update job",
      error: error.message,
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Public
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await job.deleteOne();

    res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete job",
      error: error.message,
    });
  }
};

// @desc    Submit bid for a job
// @route   POST /api/jobs/:id/bid
// @access  Public
export const submitBid = async (req, res) => {
  try {
    const { amount, message } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (!amount || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide bid amount and message",
      });
    }

    const bid = {
      amount: Number(amount),
      message: message.trim(),
    };

    job.bids.push(bid);
    await job.save();

    res.status(201).json({
      success: true,
      message: "Bid submitted successfully",
      data: bid,
    });
  } catch (error) {
    console.error("Error submitting bid:", error);
    res.status(400).json({
      success: false,
      message: "Failed to submit bid",
      error: error.message,
    });
  }
};