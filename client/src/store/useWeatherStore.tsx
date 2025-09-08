import { create } from "zustand";
import { useLocationStore } from "./useLocationStore";
import type { WeatherData, WeatherState } from "../types/weatherTypes";
import { fetchWeatherData } from "../services/weatherService";

export const useWeatherStore = create<WeatherState>()((set) => ({
  weather: null,
  loading: false,
  error: null,

  fetchWeatherByCity: async (city: string) => {
    set({ loading: true, error: null });
    try {
      const data: WeatherData | null = await fetchWeatherData(city);
      if (data) {
        set({ weather: data, loading: false });
      } else {
        set({ error: "No weather data found", loading: false });
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchWeatherByLocation: async () => {
    const { location } = useLocationStore.getState();
    if (!location) {
      console.warn("No location in store");
      return;
    }

    set({ loading: true, error: null });
    try {
      const data: WeatherData | null = await fetchWeatherData(
        undefined,
        location.latitude,
        location.longitude
      );
      if (data) {
        set({ weather: data, loading: false });
      } else {
        set({ error: "No weather data found", loading: false });
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
}));
