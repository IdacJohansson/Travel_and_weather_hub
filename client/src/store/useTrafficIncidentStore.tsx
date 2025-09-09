import { create } from "zustand";
import { fetchTrafficIncidentData } from "../services/trafficService";
import type {
  TrafficUpdateInterface,
  TrafficState,
} from "../types/trafficTypes";
import { useLocationStore } from "./useLocationStore";

export const useTrafficIncidentStore = create<TrafficState>()((set, get) => {
  const fetchTrafficIncidents = async () => {
    try {
      const { location } = useLocationStore.getState();

      if (!location) {
        console.error("Location is not set. Cannot fetch traffic updates.");
        return;
      }

      const { latitude, longitude } = location;

      const data = await fetchTrafficIncidentData(latitude, longitude);
      const situations = data.RESPONSE.RESULT[0]?.Situation || [];

      const extractedUpdates: TrafficUpdateInterface[] = situations
        .flatMap((situation: any) =>
          situation.Deviation.map((deviation: any) => {
            const geom = deviation.Geometry?.WGS84;
            let lat, lon;
            if (geom) {
              const coords = geom
                .replace("POINT (", "")
                .replace(")", "")
                .split(" ");
              lon = parseFloat(coords[0]);
              lat = parseFloat(coords[1]);
            }

            return {
              MessageCode: deviation.MessageCode,
              Message: deviation.Message,
              SeverityText: deviation.SeverityText,
              CreationTime: deviation.CreationTime,
              LocationDescriptor: deviation.LocationDescriptor,
              lat,
              lon,
            };
          })
        )
        .slice(0, 3);

      set({ trafficUpdates: extractedUpdates });
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Mycket stor påverkan":
        return "text-red-600";
      case "Stor påverkan":
        return "text-orange-600";
      case "Liten påverkan":
        return "text-yellow-500";
      case "Ingen påverkan":
        return "text-green-600";
      default:
        return "text-white";
    }
  };

  const getSeverityCount = (severtyCount: string) => {
    return get().trafficUpdates.filter(
      (update) => update.SeverityText === severtyCount
    ).length;
  };

  return {
    trafficUpdates: [],
    fetchTrafficIncidents,
    getSeverityColor,
    getSeverityCount,
  };
});
