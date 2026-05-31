require("dotenv").config();

const mongoose = require("mongoose");

async function connectDB() {
  const uri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/alumni_system";

  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(uri);
}

async function testConnection() {
  try {
    await connectDB();
    await mongoose.connection.db.admin().ping();
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

module.exports = { connectDB, testConnection, mongoose };
