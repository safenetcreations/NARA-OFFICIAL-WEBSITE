/**
 * Stormglass Maritime Weather API Service
 * High-resolution wave, temperature, currents, and tide forecasts
 * API Documentation: https://docs.stormglass.io/
 */

const API_KEY = import.meta.env.VITE_STORMGLASS_API_KEY;
const BASE_URL = 'https://api.stormglass.io/v2';

// Sri Lanka key maritime locations
export const SRI_LANKA_LOCATIONS = {
  colombo: { lat: 6.9271, lng: 79.8612, name: 'Colombo Port' },
  trincomalee: { lat: 8.5874, lng: 81.2152, name: 'Trincomalee Port' },
  galle: { lat: 6.0367, lng: 80.217, name: 'Galle Port' },
  hambantota: { lat: 6.1246, lng: 81.1185, name: 'Hambantota Port' },
  jaffna: { lat: 9.6615, lng: 80.0255, name: 'Jaffna' },
  batticaloa: { lat: 7.7102, lng: 81.6924, name: 'Batticaloa' }
};

/**
 * Fetch weather point data for specific coordinates
 */
export async function fetchWeatherPoint(lat, lng, params = []) {
  const defaultParams = ['waveHeight', 'waterTemperature', 'currentSpeed', 'currentDirection', 'seaLevel'];
  const paramString = (params.length > 0 ? params : defaultParams).join(',');
  
  try {
    const response = await fetch(
      `${BASE_URL}/weather/point?lat=${lat}&lng=${lng}&params=${paramString}`,
      {
        headers: {
          'Authorization': API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Stormglass API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: processWeatherData(data),
      rawData: data
    };
  } catch (error) {
    console.error('Stormglass fetch error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Fetch tide data for location
 */
export async function fetchTideData(lat, lng) {
  try {
    const response = await fetch(
      `${BASE_URL}/tide/extremes/point?lat=${lat}&lng=${lng}`,
      {
        headers: {
          'Authorization': API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Stormglass Tide API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: processTideData(data)
    };
  } catch (error) {
    console.error('Stormglass tide fetch error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Fetch multiple locations data
 */
export async function fetchMultipleLocations(locations = Object.values(SRI_LANKA_LOCATIONS)) {
  const promises = locations.map(loc => 
    fetchWeatherPoint(loc.lat, loc.lng).then(result => ({
      ...result,
      location: loc
    }))
  );

  const results = await Promise.all(promises);
  return results;
}

/**
 * Process weather data for easier consumption
 */
function processWeatherData(data) {
  if (!data.hours || data.hours.length === 0) {
    return null;
  }

  const processed = data.hours.map(hour => {
    const getAverage = (param) => {
      if (!hour[param]) return null;
      const values = Object.values(hour[param]).filter(v => typeof v === 'number');
      return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
    };

    return {
      time: hour.time,
      waveHeight: getAverage('waveHeight'),
      waterTemperature: getAverage('waterTemperature'),
      currentSpeed: getAverage('currentSpeed'),
      currentDirection: getAverage('currentDirection'),
      seaLevel: getAverage('seaLevel'),
      swellHeight: getAverage('swellHeight'),
      swellDirection: getAverage('swellDirection'),
      windSpeed: getAverage('windSpeed'),
      windDirection: getAverage('windDirection')
    };
  });

  return {
    hours: processed,
    current: processed[0],
    forecast: processed.slice(1, 25) // Next 24 hours
  };
}

/**
 * Process tide data
 */
function processTideData(data) {
  if (!data.data || data.data.length === 0) {
    return null;
  }

  return data.data.map(tide => ({
    time: tide.time,
    height: tide.height,
    type: tide.type // 'high' or 'low'
  }));
}

/**
 * Get current conditions for a location
 */
export async function getCurrentConditions(locationKey) {
  const location = SRI_LANKA_LOCATIONS[locationKey];
  if (!location) {
    return { success: false, error: 'Invalid location' };
  }

  return await fetchWeatherPoint(location.lat, location.lng);
}

export default {
  fetchWeatherPoint,
  fetchTideData,
  fetchMultipleLocations,
  getCurrentConditions,
  SRI_LANKA_LOCATIONS
};
