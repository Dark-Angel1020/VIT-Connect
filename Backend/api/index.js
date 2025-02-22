const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

// CORS Configuration
const allowedOrigins = ["https://vit-frontend-deepak-georges-projects.vercel.app"]; // Add your frontend URL
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Middleware to manually set headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigins.includes(req.headers.origin) ? req.headers.origin : "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Handle preflight requests
  }

  next();
});

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error("Error: MONGODB_URI is not defined.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Schema & Model
const dataSchema = new mongoose.Schema({
  ID: { type: String, required: true, unique: true },
  Name: { type: String, required: true },
  Email: { type: String, required: true },
  Mobile: { type: String, required: true },
});

const Data = mongoose.model("Data", dataSchema, "Data");

// API Route
app.get("/api/search/:id", async (req, res) => {
  try {
    let id = req.params.id;
    console.log(`Received search request for ID: ${id}`);

    const result = await Data.findOne({ ID: id });

    if (!result) {
      console.log(`ID not found: ${id}`);
      return res.status(404).json({ message: "ID not found" });
    }

    res.json({
      id: result.ID.trim(),
      name: result.Name.trim(),
      email: result.Email.trim(),
      phone: result.Mobile || "Not Available",
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
