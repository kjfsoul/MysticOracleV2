import axios from 'axios';
import { log } from './vite';
import NodeGeocoder from 'node-geocoder';

export interface GeoLocation {
  latitude: number;
  longitude: number;
  resolvedLocation: string;
  timezone?: string;
  country?: string;
  state?: string;
  city?: string;
  valid: boolean;
}

// Initialize NodeGeocoder with OpenStreetMap provider (no API key required)
const geocoder = NodeGeocoder({
  provider: 'openstreetmap',
  formatter: null,
  // Increase timeout for slow connections
  timeout: 5000
});

/**
 * Geocode a location string to get its coordinates using multiple providers
 * @param locationStr Location string (e.g., "New York, NY")
 * @returns Promise with validated geolocation data
 */
export async function geocodeLocation(locationStr: string): Promise<GeoLocation> {
  // Default return for invalid locations
  const invalidLocation: GeoLocation = {
    latitude: 0,
    longitude: 0,
    resolvedLocation: locationStr || "Unknown location",
    valid: false
  };

  // If location string is empty or too short, return invalid result
  if (!locationStr || locationStr.trim().length < 3) {
    log("Invalid location string provided", "geocoding");
    return invalidLocation;
  }

  // Clean up the location string
  const cleanLocation = locationStr.trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s,.-]/g, '')
    .toLowerCase()
    .replace(/\s*,\s*/g, ',')
    .split(',')[0]; // Take just the city name for better matching

  try {
    // First try NodeGeocoder with OpenStreetMap
    const nodeResults = await geocoder.geocode(locationStr);
    
    if (nodeResults && nodeResults.length > 0) {
      const location = nodeResults[0];
      
      // Check for valid coordinates
      if (typeof location.latitude === 'number' && typeof location.longitude === 'number') {
        // Build a formatted location string
        const addressComponents = [
          location.city,
          location.state,
          location.country
        ].filter(Boolean);
        
        const formattedAddress = location.formattedAddress || 
                                 addressComponents.join(", ") || 
                                 locationStr;
        
        return {
          latitude: location.latitude,
          longitude: location.longitude,
          resolvedLocation: formattedAddress,
          timezone: location.timezone,
          country: location.country,
          state: location.administrativeLevels?.level1long,
          city: location.city,
          valid: true
        };
      }
    }

    // If NodeGeocoder fails, try direct Nominatim API
    log("NodeGeocoder failed, trying direct Nominatim API", "geocoding");
    return await fallbackToNominatim(locationStr);
  } catch (error) {
    log(`Error geocoding location ${locationStr}: ${error}`, 'geocoding');
    
    // Try direct Nominatim API as fallback
    try {
      return await fallbackToNominatim(locationStr);
    } catch (fallbackError) {
      log(`Fallback geocoding also failed: ${fallbackError}`, 'geocoding');
      
      // Try common locations database if API methods fail
      const knownLocation = getKnownLocation(locationStr);
      if (knownLocation) {
        return knownLocation;
      }
      
      return invalidLocation;
    }
  }
}

/**
 * Fallback geocoding using Nominatim API directly
 * @param locationStr Location string to geocode
 * @returns GeoLocation object
 */
async function fallbackToNominatim(locationStr: string): Promise<GeoLocation> {
  try {
    // Use Nominatim (OpenStreetMap) geocoding service directly
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`, 
      {
        params: {
          q: locationStr,
          format: 'json',
          addressdetails: 1,
          limit: 1
        },
        headers: {
          'User-Agent': 'Mystic-Arcana-App/1.0'
        }
      }
    );

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      const address = result.address || {};
      
      // Extract address components
      const city = address.city || address.town || address.village || '';
      const state = address.state || address.county || '';
      const country = address.country || '';
      
      // Create a formatted location
      const addressComponents = [city, state, country].filter(Boolean);
      const resolvedLocation = addressComponents.length > 0 
        ? addressComponents.join(", ") 
        : (result.display_name || locationStr);
      
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        resolvedLocation: resolvedLocation,
        country: country,
        state: state,
        city: city,
        valid: true
      };
    }

    // If no results found
    log(`No geocoding results found for location: ${locationStr}`, 'geocoding');
    
    // Try known locations database
    const knownLocation = getKnownLocation(locationStr);
    if (knownLocation) {
      return knownLocation;
    }
    
    return {
      latitude: 0,
      longitude: 0,
      resolvedLocation: locationStr,
      valid: false
    };
  } catch (error) {
    log(`Error with Nominatim API: ${error}`, 'geocoding');
    throw error;
  }
}

/**
 * Get coordinates for well-known locations from our database
 * @param locationStr Location string
 * @returns GeoLocation object or null
 */
function getKnownLocation(locationStr: string): GeoLocation | null {
  // Convert to lowercase for case-insensitive matching
  const location = locationStr.toLowerCase().trim();
  
  // Dictionary of major cities worldwide
  const knownLocations: Record<string, GeoLocation> = {
    'new york': { 
      latitude: 40.7128, 
      longitude: -74.0060, 
      resolvedLocation: "New York City, USA",
      country: "United States",
      state: "New York",
      city: "New York City", 
      valid: true 
    },
    'tampa': {
      latitude: 27.9506, 
      longitude: -82.4572,
      resolvedLocation: "Tampa, Florida, USA",
      country: "United States",
      state: "Florida",
      city: "Tampa",
      valid: true
    },
    'nyc': { 
      latitude: 40.7128, 
      longitude: -74.0060, 
      resolvedLocation: "New York City, USA",
      country: "United States",
      state: "New York",
      city: "New York City", 
      valid: true 
    },
    'london': { 
      latitude: 51.5074, 
      longitude: -0.1278, 
      resolvedLocation: "London, UK",
      country: "United Kingdom",
      city: "London", 
      valid: true 
    },
    'paris': { 
      latitude: 48.8566, 
      longitude: 2.3522, 
      resolvedLocation: "Paris, France",
      country: "France",
      city: "Paris", 
      valid: true 
    },
    'tokyo': { 
      latitude: 35.6762, 
      longitude: 139.6503, 
      resolvedLocation: "Tokyo, Japan",
      country: "Japan",
      city: "Tokyo", 
      valid: true 
    },
    'sydney': { 
      latitude: -33.8688, 
      longitude: 151.2093, 
      resolvedLocation: "Sydney, Australia",
      country: "Australia",
      state: "New South Wales",
      city: "Sydney", 
      valid: true 
    },
    'los angeles': { 
      latitude: 34.0522, 
      longitude: -118.2437, 
      resolvedLocation: "Los Angeles, USA",
      country: "United States",
      state: "California",
      city: "Los Angeles", 
      valid: true 
    },
    'la': { 
      latitude: 34.0522, 
      longitude: -118.2437, 
      resolvedLocation: "Los Angeles, USA",
      country: "United States",
      state: "California",
      city: "Los Angeles", 
      valid: true 
    },
    'chicago': { 
      latitude: 41.8781, 
      longitude: -87.6298, 
      resolvedLocation: "Chicago, USA",
      country: "United States",
      state: "Illinois",
      city: "Chicago", 
      valid: true 
    },
    'toronto': { 
      latitude: 43.6532, 
      longitude: -79.3832, 
      resolvedLocation: "Toronto, Canada",
      country: "Canada",
      state: "Ontario",
      city: "Toronto", 
      valid: true 
    },
    'berlin': { 
      latitude: 52.5200, 
      longitude: 13.4050, 
      resolvedLocation: "Berlin, Germany",
      country: "Germany",
      city: "Berlin", 
      valid: true 
    },
    'rome': { 
      latitude: 41.9028, 
      longitude: 12.4964, 
      resolvedLocation: "Rome, Italy",
      country: "Italy",
      city: "Rome", 
      valid: true 
    },
    'dubai': { 
      latitude: 25.2048, 
      longitude: 55.2708, 
      resolvedLocation: "Dubai, UAE",
      country: "United Arab Emirates",
      city: "Dubai", 
      valid: true 
    }
  };
  
  // Check if the location string is an exact match
  if (knownLocations[location]) {
    return knownLocations[location];
  }
  
  // Check if the location string contains a known location
  for (const [key, value] of Object.entries(knownLocations)) {
    if (location.includes(key)) {
      return value;
    }
  }
  
  // No match found
  return null;
}