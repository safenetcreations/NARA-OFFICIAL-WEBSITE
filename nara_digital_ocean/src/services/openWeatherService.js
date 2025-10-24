/**
 * OpenWeather Marine & Weather Service
 */

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const LOCATIONS = {
  colombo: { lat: 6.9271, lon: 79.8612, name: 'Colombo' },
  trincomalee: { lat: 8.5874, lon: 81.2152, name: 'Trincomalee' },
  galle: { lat: 6.0367, lon: 80.217, name: 'Galle' },
  hambantota: { lat: 6.1246, lon: 81.1185, name: 'Hambantota' }
};

export async function fetchWeatherData(lat, lon) {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) throw new Error(`OpenWeather API error: ${response.status}`);
    
    const data = await response.json();
    return { success: true, data: processWeatherData(data) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function fetchForecast(lat, lon) {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) throw new Error(`OpenWeather API error: ${response.status}`);
    
    const data = await response.json();
    return { success: true, data: processForecastData(data) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function fetchMultipleLocations() {
  const results = await Promise.all(
    Object.values(LOCATIONS).map(async loc => {
      const weather = await fetchWeatherData(loc.lat, loc.lon);
      return { ...weather, location: loc };
    })
  );
  return results;
}

function processWeatherData(data) {
  return {
    temp: data.main?.temp,
    feelsLike: data.main?.feels_like,
    humidity: data.main?.humidity,
    pressure: data.main?.pressure,
    windSpeed: data.wind?.speed,
    windDirection: data.wind?.deg,
    clouds: data.clouds?.all,
    description: data.weather?.[0]?.description,
    icon: data.weather?.[0]?.icon
  };
}

function processForecastData(data) {
  return data.list?.map(item => ({
    time: item.dt_txt,
    temp: item.main.temp,
    humidity: item.main.humidity,
    windSpeed: item.wind.speed,
    description: item.weather[0].description
  })) || [];
}

export default {
  fetchWeatherData,
  fetchForecast,
  fetchMultipleLocations,
  LOCATIONS
};
