import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());

const GEO_KEY = process.env.GEO_KEY;
const GEO_URL = process.env.GEO_URL;
const TRAFFIC_API_URL = process.env.TRAFFIC_API_URL;
const TRAFFIC_API_KEY = process.env.TRAFFIC_API_KEY;
const WEATHER_API_URL = process.env.WEATHER_API_URL;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const RESROBOT_NEARBYSTOPS_URL = process.env.RESROBOT_API_URL_NEARBYSTOPS;
const RESROBOT_API_URL_DEPARTURES = process.env.RESROBOT_API_URL_DEPARTURES;
const RESROBOT_API_URL_ARRIVAL = process.env.RESROBOT_API_URL_ARRIVAL;
const RESROBOT_API_KEY = process.env.RESROBOT_API_KEY;

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

app.get("/departures", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).send("Missing coordinates");
  try {
    const nearbyResponse = await axios.get(RESROBOT_NEARBYSTOPS_URL, {
      params: {
        originCoordLat: lat,
        originCoordLong: lon,
        maxNo: 3,
        accessId: process.env.RESROBOT_API_KEY,
      },
    });

    const stop =
      nearbyResponse.data.stopLocationOrCoordLocation[0]?.StopLocation;
    const extId = stop.extId;
    if (!stop?.extId) return res.status(404).send("No nearby stops found");

    const departuresResponse = await axios.get(RESROBOT_API_URL_DEPARTURES, {
      params: {
        id: extId,
        maxJourneys: 3,
        passlist: true,
        format: "json",
        accessId: RESROBOT_API_KEY,
      },
    });
    if (!departuresResponse.data.Departure) {
      return res.status(404).send("No departures found for this stop");
    }

    const newDepartures = departuresResponse.data.Departure.map((dep) => ({
      time: dep.time,
      date: dep.date,
      stop: dep.stop,
      stopExtId: dep.stopExtId,
      type: dep.type,
      direction: dep.direction,
      name: dep.Product[0]?.name || dep.name,
      line: dep.Product[0]?.displayNumber || "",
      operator: dep.Product[0]?.operator || "",
      icon: dep.Product[0]?.icon?.res || "prod_ferry",
    }));

    const arrivalsResponse = await axios.get(RESROBOT_API_URL_ARRIVAL, {
      params: {
        id: extId,
        maxJourneys: 3,
        passlist: true,
        format: "json",
        accessId: process.env.RESROBOT_API_KEY,
      },
    });
    if (!arrivalsResponse.data.Arrival) {
      return res.status(404).send("No arrivals found for this stop");
    }

    const newArrivals =
      arrivalsResponse.data.Arrival?.map((arr) => ({
        time: arr.time,
        date: arr.date,
        rtTime: arr.rtTime,
        rtDate: arr.rtDate,
        stop: arr.stop,
        stopExtId: arr.stopExtId,
        direction: arr.direction,
        name: arr.Product?.[0]?.name || arr.name,
        operator: arr.Product?.[0]?.operator || "",
        Stops:
          arr.Stops && Array.isArray(arr.Stops.Stop)
            ? arr.Stops.Stop.map((s) => ({
                name: s.name,
                arrTime: s.arrTime || s.depTime || null,
                arrDate: s.arrDate || s.depDate || null,
                lat: s.lat,
                lon: s.lon,
                extId: s.extId,
                routeIdx: s.routeIdx,
              }))
            : [],
      })) || [];

    res.json({
      nearbyStop: stop,
      departures: newDepartures,
      arrivals: newArrivals,
    });
  } catch (err) {
    console.error("Departures API error:", err);
    res.status(500).send("Failed to fetch departures");
  }
});

