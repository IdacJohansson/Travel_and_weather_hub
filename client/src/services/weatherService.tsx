import axios from "axios";
import { GEO_URL } from "./config.js";

export const fetchWeatherData = async (
  city?: string,
  lat?: number,
  lon?: number
) => {
  try {
    let url = "";

    if (city) {
      const baseURL = import.meta.env.VITE_GEO_URL || GEO_URL;
      const response = await axios.get(`${baseURL}`, {
        params: { q: city },
      });

      const data = response.data;
      if (!data?.results?.length) {
        throw new Error("Could not find location for the specified city");
      }

      const { lat: geoLat, lng } = data.results[0].geometry.location;
      url = `/api/weather?lat=${geoLat}&lon=${lng}`;
    } else if (lat && lon) {
      url = `/api/weather?lat=${lat}&lon=${lon}`;
    } else {
      throw new Error("No city or coordinates was specified");
    }

    const weatherRes = await axios.get(url);
    return weatherRes.data;
  } catch (error: any) {
    console.error("Error fetching weather:", error);
    return null;
  }
};
