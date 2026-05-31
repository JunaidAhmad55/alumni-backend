const { mongoose } = require("../config/db");

const alumniUserSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },
    sap_id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    department: String,
    degree_program: String,
    graduation_year: String,
    job_title: String,
    company: String,
    linkedin: String,
    address: String,
    password: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
    collection: "alumni_users",
  }
);

module.exports = mongoose.model("AlumniUser", alumniUserSchema);
