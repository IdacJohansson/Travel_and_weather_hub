import { create } from "zustand";
import { fetchDeparturesData } from "../services/departuresService";
import type {
  DepartureInterface,
  ArrivalsInterface,
  DepartureState,
} from "../types/departureTypes";
import { useLocationStore } from "./useLocationStore";

export const useDepartureStore = create<DepartureState>()((set): any => {
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
        .slice(0, 5)
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

      const arrivals = data.arrivals || [];
      const extractedArrivals: ArrivalsInterface[] = arrivals
        .slice(0, 4)
        .map((arr: any) => ({
          name: arr.name,
          line: arr.line,
          direction: arr.direction,
          time: arr.time,
          date: arr.date,
          operator: arr.operator,
          stop: data.nearbyStop.name,
          stopExtId: data.nearbyStop.extId,
          type: arr.type || "arrival",
          icon: arr.icon,
          rtTime: arr.rtTime || "",
          rtDate: arr.rtDate || "",
          Stops:
            arr.Stops?.map((s: any) => ({
              name: s.name,
              arrTime: s.arrTime || "",
              arrDate: s.arrDate || "",
              depTime: s.depTime || "",
              depDate: s.depDate || "",
              track: s.track || "",
            })) || [],
        }));

      set({
        departureUpdates: extractedDepartures,
        arrivalsUpdates: extractedArrivals,
      });
    } catch (error) {
      console.error("Error fetching departures:", error);
    }
  };

  return {
    departureUpdates: [],
    arrivalsUpdates: [],
    fetchDepartures,
  };
});
