export interface CityConfig {
  CityCode: string;
  CityName: string;
  Temp: string;
  Status: string;
}

export interface CitiesJson {
  List: CityConfig[];
}

export interface RawWeatherResponse {
  coord: { lon: number; lat: number };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base?: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: { all: number };
  rain?: { "1h"?: number; "3h"?: number };
  snow?: { "1h"?: number; "3h"?: number };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    message?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface WeatherData {
  cityId: string;
  cityName: string;
  country: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  cloudiness: number;
  visibility: number;
  description: string;
  icon: string;
  dt: number;
}

export interface ComfortBreakdown {
  temperatureScore: number;
  humidityScore: number;
  windScore: number;
  cloudinessScore: number;
  total: number;
}

export interface CityRanking {
  rank: number;
  cityId: string;
  cityName: string;
  country: string;
  temperature: number;
  description: string;
  comfort: ComfortBreakdown;
}
