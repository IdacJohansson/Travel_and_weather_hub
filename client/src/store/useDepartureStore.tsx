import { create } from "zustand";
import { fetchDeparturesData } from "../services/departuresService";
import type {
  DepartureInterface,
  DepartureState,
} from "../types/departureTypes";
import { useLocationStore } from "./useLocationStore";

export const useDepartureStore = create<DepartureState>()((set) => {
  const fetchDepartures = async () => {
    try {
      const { location } = useLocationStore.getState();

      if (!location) {
        console.error("Location is not set. Cannot fetch departures.");
        return;
      }

      const { latitude, longitude } = location;

      const data = await fetchDeparturesData(latitude, longitude);
      const departures = data.departures || [];

      const extractedDepartures: DepartureInterface[] = departures
        .slice(0, 3)
        .map((dep: any) => ({
          name: dep.name,
          line: dep.line,
          direction: dep.direction,
          time: dep.time,
          operator: dep.operator,
          stop: data.nearbyStop.name,
          stopExtId: data.nearbyStop.extId,
          date: dep.date,
          type: dep.type,
          icon: dep.icon,
        }));

      set({ departureUpdates: extractedDepartures });
    } catch (error) {
      console.error("Error fetching departures:", error);
    }
  };

  return {
    departureUpdates: [],
    fetchDepartures,
  };
});
