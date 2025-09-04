import axios from "axios";
import { TRAFFIC_API_URL } from "./config.js";

const baseURL = TRAFFIC_API_URL;
console.log(baseURL);

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
