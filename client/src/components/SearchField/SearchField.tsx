import "./SearchField.css";
import { GEO_URL } from "../../services/config";
import { useState, useEffect } from "react";
import { useLocationStore } from "../../store/useLocationStore";
import { useTrafficIncidentStore } from "../../store/useTrafficIncidentStore";
import { useWeatherStore } from "../../store/useWeatherStore";
import { useDepartureStore } from "../../store/useDepartureStore";

const SearchField = () => {
  const { fetchTrafficIncidents } = useTrafficIncidentStore();
  const { fetchWeatherByLocation } = useWeatherStore();
  const { fetchDepartures } = useDepartureStore();
  const { location, setLocation, setAddress } = useLocationStore();
  const [query, setQuery] = useState("");
  const [isBgChange, setIsBgChange] = useState(false);

  const URL = import.meta.env.VITE_GEO_URL || GEO_URL;

  useEffect(() => {
    if (location) {
      fetchTrafficIncidents();
      fetchWeatherByLocation();
      fetchDepartures();
    }
  }, [
    location,
    fetchTrafficIncidents,
    fetchWeatherByLocation,
    fetchDepartures,
  ]);

  const handleSearch = async () => {
    setIsBgChange(true);
    if (!query.trim()) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          ({ coords: { latitude, longitude } }) => {
            setLocation({ latitude, longitude });
          },
          () => console.log("Unable to get location")
        );
      }
      return;
    }

    try {
      const response = await fetch(`${URL}?q=${encodeURIComponent(query)}`);

      const data = await response.json();
      console.log(data);

      if (data?.results?.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setLocation({ latitude: lat, longitude: lng });
        setAddress(data.results[0].formatted_address);
      } else {
        console.log("No results was find.");
      }
    } catch (error) {
      console.error("Error, could not get Geocode:", error);
    }
  };

  return (
    <div
      className={`main-container h-screen w-full ${
        isBgChange
          ? "bg-black"
          : "bg-[url('/transportation.png')] bg-center bg-auto bg-no-repeat"
      }`}
    >
      <div className="search-container">
        <input
          type="text"
          placeholder="Search location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-field"
        />
        <button onClick={handleSearch} className="search-btn">
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchField;
