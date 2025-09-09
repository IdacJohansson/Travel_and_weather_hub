import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "../Map/Map.css";

import { useLocationStore } from "../../store/useLocationStore";
import { useTrafficIncidentStore } from "../../store/useTrafficIncidentStore";

const MapUpdater = ({ center }: { center: LatLngExpression }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 8); 
  }, [center, map]);
  return null;
};

const Map = () => {
  const { trafficUpdates } = useTrafficIncidentStore();
  const { location } = useLocationStore();

  const defaultCenter: LatLngExpression = [0, 0];
  const center: LatLngExpression = location
    ? [location.latitude, location.longitude]
    : defaultCenter;

  return (
    <MapContainer
      center={center}
      scrollWheelZoom={false}
      className="w-[400px] h-[400px] rounded-xl text-white text-center p-4"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapUpdater center={center} />

      {trafficUpdates
        .filter((item) => item.lat && item.lon)
        .map((incident, id) => (
          <Marker key={id} position={[incident.lat!, incident.lon!]}>
            <Popup>
              <strong>{incident.SeverityText}</strong>
              <br />
              {incident.Message}
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
};

export default Map;
