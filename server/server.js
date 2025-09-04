import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT;
const GEO_KEY = process.env.GEO_KEY;
const GEO_URL = process.env.GEO_URL;
const TRAFFIC_API_URL = process.env.TRAFFIC_API_URL;
const TRAFFIC_API_KEY = process.env.TRAFFIC_API_KEY;

app.get("/api/geocode", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Missing query" });

  try {
    const response = await axios.get(GEO_URL, {
      params: { q, api: GEO_KEY },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch from Geokeo" });
  }
});

app.get("/traffic-situations", async (req, res) => {
  const { latitude, longitude } = req.query;
  if (!latitude || !longitude) {
    return res.status(400).send("Missing latitude or longitude parameters");
  }
  console.log(
    `Received latitude in traffic: ${latitude}, longitude: ${longitude}`
  );

  const trafficXML = `<REQUEST>
  <LOGIN authenticationkey="${TRAFFIC_API_KEY}" />
  <QUERY objecttype="Situation" schemaversion="1" limit="5">
    <FILTER>
      <NEAR name="Deviation.Geometry.WGS84" value="${longitude} ${latitude}" />
      <LT name="Deviation.CreationTime" value="$now" />
      <GT name="Deviation.CreationTime" value="$dateadd(-7.00:00:00)" />
    </FILTER>
    <INCLUDE>Deviation.CreationTime</INCLUDE>
    <INCLUDE>Deviation.Geometry.WGS84</INCLUDE>
    <INCLUDE>Deviation.Message</INCLUDE>
    <INCLUDE>Deviation.MessageCode</INCLUDE>
    <INCLUDE>Deviation.LocationDescriptor</INCLUDE>
    <INCLUDE>Deviation.SeverityText</INCLUDE>
  </QUERY>
</REQUEST>`;

  try {
    const response = await axios.post(TRAFFIC_API_URL, trafficXML, {
      headers: {
        "Content-Type": "text/xml",
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching traffic situations:", error);
    res.status(500).send("Failed fetching data");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
