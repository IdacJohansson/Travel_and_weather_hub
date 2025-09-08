export interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: { description: string; icon: string }[];
}

export interface WeatherState {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  fetchWeatherByCity: (city: string) => Promise<void>;
  fetchWeatherByLocation: () => Promise<void>;
}
