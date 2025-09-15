import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
app.use(cors());

const WEATHER_API_URL = process.env.WEATHER_API_URL;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

app.get("/api/weather", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).send("Missing coordinates");

  try {
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        lat,
        lon,
        units: "metric",
        appid: WEATHER_API_KEY,
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error("Weather API error:", err);
    res.status(500).send("Failed to fetch weather");
  }
});

export const handler = serverless(app);