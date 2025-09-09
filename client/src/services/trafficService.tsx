import axios from "axios";
import { TRAFFIC_URL } from "./config.js";

const baseURL = import.meta.env.VITE_TRAFFIC_URL || TRAFFIC_URL;

export const fetchTrafficIncidentData = async (
  latitude: number,
  longitude: number
) => {
  try {
    const response = await axios.get(`${baseURL}`, {
      params: { longitude, latitude },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching traffic data:", error);
    throw error;
  }
};
