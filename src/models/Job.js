const { mongoose } = require("../config/db");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    job_type: String,
    posted_date: String,
    deadline: String,
    description: String,
    apply_link: String,
    status: { type: String, default: "active" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
    collection: "jobs",
  }
);

module.exports = mongoose.model("Job", jobSchema);
