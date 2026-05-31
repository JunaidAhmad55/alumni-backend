const express = require("express");
const Job = require("../models/Job");
const { formatDocs } = require("../utils/formatDoc");

const router = express.Router();

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

router.post("/add_job.php", async (req, res) => {
  const {
    title = "",
    company = "",
    location = "",
    job_type = "",
    posted_date = "",
    deadline = "",
    description = "",
    apply_link = "",
  } = req.body;

  if (!title || !company || !location) {
    return res.json({
      success: false,
      message: "Title, company and location are required",
    });
  }

  try {
    await Job.create({
      title,
      company,
      location,
      job_type,
      posted_date,
      deadline,
      description,
      apply_link,
      status: "active",
    });

    return res.json({
      success: true,
      message: "Job posted successfully",
    });
  } catch {
    return res.json({
      success: false,
      message: "Failed to post job",
    });
  }
});

router.get("/get_jobs.php", async (_req, res) => {
  const today = todayString();

  try {
    const jobs = await Job.find({ deadline: { $gte: today } })
      .sort({ _id: -1 })
      .exec();

    return res.json({
      success: true,
      jobs: formatDocs(jobs),
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
});

router.get("/search_jobs.php", async (req, res) => {
  const query = req.query.query || "";

  try {
    const jobs = await Job.find({
      status: "active",
      title: { $regex: query, $options: "i" },
    })
      .sort({ _id: -1 })
      .exec();

    return res.json({
      success: true,
      jobs: formatDocs(jobs),
      message:
        jobs.length > 0
          ? "Jobs found"
          : "Currently this job is not available",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
});

router.get("/expired_jobs.php", async (_req, res) => {
  const today = todayString();

  try {
    const jobs = await Job.find({ deadline: { $lt: today } })
      .sort({ _id: -1 })
      .exec();

    return res.json({
      success: true,
      jobs: formatDocs(jobs),
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch expired jobs",
    });
  }
});

module.exports = router;
