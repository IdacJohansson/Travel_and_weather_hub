import axios from "axios";
import { DEPARTURES_URL } from "./config";

const baseURL = import.meta.env.VITE_DEPARTURES_URL || DEPARTURES_URL;

export const fetchDeparturesData = async (
  latitude: number,
  longitude: number
) => {
  try {
    const response = await axios.get(`${baseURL}`, {
      params: { lat: latitude, lon: longitude },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching departures data:", error);
    throw error;
  }
};

