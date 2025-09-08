import { useEffect } from "react";
import { useLocationStore } from "../../store/useLocationStore";
import { useWeatherStore } from "../../store/useWeatherStore";

import WeatherImg from "../../assets/white-lightning.png";

const Weather = () => {
  const {
    weather,
    loading,
    error,
    fetchWeatherByLocation,
  } = useWeatherStore();
  const { location } = useLocationStore();

  useEffect(() => {
    if (location) {
      fetchWeatherByLocation();
    }
  }, [location]);

  return (
    <div className="bg-raisinBlack text-black rounded-2xl p-4 flex gap-4 w-[510px] h-[300px]">
      {loading && <p className="text-white">Loading weather...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {weather ? (
        <div className="flex w-full">
          <div className="text-white flex-col justify-between items-center px-4 h-[170px]">
            <h2 className="text-xl">
              <span className="font-bold text-left">WEATHER IN:</span>{" "}
              {weather.name}
            </h2>

            <div className="flex justify-center text-center gap-4 mt-4">
              {/* Temperaturkort */}
              <div className="bg-onyx rounded-2xl flex flex-col gap-2 items-center justify-center w-[220px] h-[200px]">
                <div className="text-5xl">🌡️</div>
                <div className="mt-3">
                  <p>
                    <span className="font-bold">Temperature:</span>{" "}
                    {weather.main.temp}°C
                  </p>
                </div>
              </div>

              {/* Väderkort */}
              <div className="bg-onyx rounded-2xl flex flex-col gap-2 items-center justify-center w-[220px] h-[200px]">
                <p>
                  <span className="font-bold">Condition:</span>{" "}
                  {weather.weather[0].description}
                </p>
                <div className="flex items-center justify-center">
                  <img
                    className="w-[90px] h-[90px]"
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                    alt="weather icon"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : !loading ? (
        <div className="bg-raisinBlack text-white rounded-2xl flex gap-4 w-[510px] h-[170px]">
          <div className="flex-1 bg-onyx flex justify-center items-center h-[250px] rounded-2xl mt-2">
            <img
              className="w-1/2 animate-pulse"
              src={WeatherImg}
              alt="loading weather"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Weather;
