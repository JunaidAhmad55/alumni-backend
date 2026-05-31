const express = require("express");
const bcrypt = require("bcryptjs");
const AlumniUser = require("../models/AlumniUser");
const { formatDoc } = require("../utils/formatDoc");

const router = express.Router();

router.post("/login.php", async (req, res) => {
  const { sap_id, password } = req.body;

  if (!sap_id || !password) {
    return res.json({
      success: false,
      message:
        "Sign-in failed. Please check your SAP ID/Registration number or register first.",
    });
  }

  try {
    const user = await AlumniUser.findOne({
      $or: [{ sap_id }, { email: sap_id }],
    });

    if (!user) {
      return res.json({
        success: false,
        message:
          "Sign-in failed. Please check your SAP ID/Registration number or register first.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const formatted = formatDoc(user);
      return res.json({
        success: true,
        message: "Login successful",
        user: {
          id: formatted.id,
          full_name: formatted.full_name,
          email: formatted.email,
        },
      });
    }

    return res.json({
      success: false,
      message: "Incorrect password. Please try again.",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

router.post("/register.php", async (req, res) => {
  const {
    full_name,
    sap_id,
    email,
    phone,
    department,
    degree_program,
    graduation_year,
    job_title,
    company,
    linkedin,
    address,
    password,
  } = req.body;

  try {
    const existing = await AlumniUser.findOne({
      $or: [{ sap_id }, { email }],
    });

    if (existing) {
      return res.json({
        success: false,
        message: "User already registered with this SAP ID or Email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await AlumniUser.create({
      full_name,
      sap_id,
      email,
      phone,
      department,
      degree_program,
      graduation_year,
      job_title,
      company,
      linkedin,
      address,
      password: hashedPassword,
    });

    return res.json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.json({
        success: false,
        message: "User already registered with this SAP ID or Email",
      });
    }

    return res.json({
      success: false,
      message: "Registration failed",
    });
  }
});

module.exports = router;
