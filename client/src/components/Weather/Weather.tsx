import "../Weather/Weather.css";
import { useEffect, useState } from "react";
import { useLocationStore } from "../../store/useLocationStore";
import { useWeatherStore } from "../../store/useWeatherStore";

const Weather = () => {
  const { weather, loading, error, fetchWeatherByLocation } = useWeatherStore();
  const { location } = useLocationStore();
  const [temp, setTemp] = useState<number | null>(null);

  useEffect(() => {
    if (location) {
      fetchWeatherByLocation();
    }
  }, [location]);

  useEffect(() => {
    if (weather && weather.main && weather.main.temp) {
      setTemp(weather.main.temp);
    }
  }, [weather]);

  const getTempIcon = (t: number) => {
    if (t <= 5) {
      return <i className="bi bi-thermometer-snow"></i>;
    } else if (t > 18) {
      return <i className="bi bi-thermometer-sun"></i>;
    } else {
      return <i className="bi bi-thermometer-half"></i>;
    }
  };

  return (
    <div className="weather-container">
      {loading && <p className="text-loading">Loading weather...</p>}
      {error && <p className="text-error">Error: {error}</p>}

      {weather && (
        <div className="weather-wrapper">
          <div className="weather-content">
            <h2 className="text-h2">
              <span className="text-city">Weather in:</span> {weather.name}
            </h2>

            <div className="content-wrapper">
              <div className="temp-card">
                <div className="temp-icon">
                  {getTempIcon(weather.main.temp)}
                </div>
                <div className="temp-text-container">
                  <p>
                    <span className="temp-text">Temperature:</span>{" "}
                    {weather.main.temp}°C
                  </p>
                </div>
              </div>
              <div className="description-card">
                <p>
                  <span className="description-text">Condition:</span>{" "}
                  {weather.weather[0].description}
                </p>
                <div className="description-icon-container">
                  <img
                    className="description-icon"
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                    alt="weather icon"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
