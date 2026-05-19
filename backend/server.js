import "dotenv/config";
import express, { json } from "express";
import cors from "cors";
import axios from "axios";

const app = express();

app.use(cors());
app.use(json());

import userRoutes from "./Routes/userRoutes.js";
import doctorRoutes from "./Routes/doctorRoutes.js";
import contactRoutes from "./Routes/contactRoutes.js";

app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/contacts', contactRoutes);

// Proxy endpoint for searching news to bypass CORS policy restrictions in front-end
app.get("/api/news", async (req, res) => {
  const query = req.query.q || req.query.query || "";
  const apiKey = "8bbcf12673d4c2f57443df9ef9524fbd2ae1847441e648f8c2fe7d8d4edcc667";
  
  try {
    const response = await axios.get(`https://api.freenewsapi.io/v1/news?q=${encodeURIComponent(query)}`, {
      headers: {
        'x-api-key': apiKey
      }
    });
    res.json(response.data);
  } catch (error) {
    console.warn("Primary proxy API fetch failed, trying secondary URL query param parameter...");
    try {
      const response = await axios.get(`https://api.freenewsapi.io/v1/news?q=${encodeURIComponent(query)}&apiKey=${apiKey}`);
      res.json(response.data);
    } catch (innerError) {
      console.error("Secondary proxy news fetch failed:", innerError.message);
      res.status(500).json({ error: "Failed to fetch news from third-party API." });
    }
  }
});

// Proxy endpoint for full article details to bypass CORS policy restrictions in front-end
app.get("/api/news/details", async (req, res) => {
  const uuid = req.query.uuid || "";
  const apiKey = "8bbcf12673d4c2f57443df9ef9524fbd2ae1847441e648f8c2fe7d8d4edcc667";
  
  if (!uuid) {
    return res.status(400).json({ error: "UUID is required." });
  }

  try {
    const response = await axios.get(`https://api.freenewsapi.io/v1/details?uuid=${uuid}`, {
      headers: {
        'x-api-key': apiKey
      }
    });
    res.json(response.data);
  } catch (error) {
    console.warn("Primary proxy details fetch failed, trying secondary URL query param parameter...");
    try {
      const response = await axios.get(`https://api.freenewsapi.io/v1/details?uuid=${uuid}&apiKey=${apiKey}`);
      res.json(response.data);
    } catch (innerError) {
      console.error("Secondary proxy details fetch failed:", innerError.message);
      res.status(500).json({ error: "Failed to fetch news details from third-party API." });
    }
  }
});

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server Running on ${process.env.PORT || 5000}`);
});