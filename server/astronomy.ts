import sweph from 'sweph';
import { log } from './vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { geocodeLocation, GeoLocation } from './geocoding';

// Initialize Swiss Ephemeris - adapted for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ephePath = path.join(__dirname, '../node_modules/sweph/ephe');
sweph.set_ephe_path(ephePath);

// Set up house system and sidereal mode constants
const HOUSE_SYSTEM = 'P'; // Placidus house system (most common)
const SIDEREAL_MODE = 0;  // Tropical zodiac (0 = tropical, 1 = sidereal)

// Swiss Ephemeris constants for planet bodies
const SE_SIDEREAL = 0;    // Tropical vs sidereal setting
const SE_SWIEPH = 2;      // Ephemeris flag
const SE_SPEED = 256;     // Return speed flag

export interface PlanetPosition {
  sign: string;
  degree: number;
  retrograde?: boolean;
}

export interface PlanetPositions {
  sun: PlanetPosition;
  moon: PlanetPosition;
  mercury: PlanetPosition;
  venus: PlanetPosition;
  mars: PlanetPosition;
  jupiter: PlanetPosition;
  saturn: PlanetPosition;
  uranus: PlanetPosition;
  neptune: PlanetPosition;
  pluto: PlanetPosition;
  [key: string]: PlanetPosition;
}

export interface ChartData {
  sun: PlanetPosition;
  moon: PlanetPosition;
  mercury: PlanetPosition;
  venus: PlanetPosition;
  mars: PlanetPosition;
  jupiter: PlanetPosition;
  saturn: PlanetPosition;
  uranus: PlanetPosition;
  neptune: PlanetPosition;
  pluto: PlanetPosition;
  validLocation: boolean;
  formattedLocation: string;
  houses?: number[];
  ascendant?: PlanetPosition;
}

const zodiacSigns = [
  { sign: "Aries", start: 0 },
  { sign: "Taurus", start: 30 },
  { sign: "Gemini", start: 60 },
  { sign: "Cancer", start: 90 },
  { sign: "Leo", start: 120 },
  { sign: "Virgo", start: 150 },
  { sign: "Libra", start: 180 },
  { sign: "Scorpio", start: 210 },
  { sign: "Sagittarius", start: 240 },
  { sign: "Capricorn", start: 270 },
  { sign: "Aquarius", start: 300 },
  { sign: "Pisces", start: 330 }
];

const PLANETS = {
  SUN: 0,
  MOON: 1,
  MERCURY: 2,
  VENUS: 3,
  MARS: 4,
  JUPITER: 5,
  SATURN: 6,
  URANUS: 7,
  NEPTUNE: 8,
  PLUTO: 9
};

function longitudeToZodiacPosition(longitude: number): { sign: string; degree: number } {
  longitude = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(longitude / 30);
  const degree = parseFloat((longitude % 30).toFixed(1));
  return {
    sign: zodiacSigns[signIndex].sign,
    degree
  };
}

function getJulianDay(dateStr: string, timeStr: string = "12:00", location: string = ""): number {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const timeComponents = timeStr.split(':');
  const hour = parseInt(timeComponents[0]) || 12;
  const minute = parseInt(timeComponents[1]) || 0;
  const second = parseInt(timeComponents[2]) || 0;

  const dayWithTime = day + (hour / 24) + (minute / (24 * 60)) + (second / (24 * 60 * 60));
  const gregflag = 1;

  try {
    return sweph.julday(year, month, dayWithTime, 0, gregflag);
  } catch (error) {
    log(`Error calculating Julian day: ${error}`, "astronomy");
    return (date.getTime() / 86400000) + 2440587.5;
  }
}

export async function validateLocation(locationString: string): Promise<{
  latitude: number;
  longitude: number;
  formattedAddress: string;
  valid: boolean;
}> {
  try {
    const geoLocation = await geocodeLocation(locationString);
    log(`Geocoding result for "${locationString}": ${geoLocation.valid ? "Valid" : "Invalid"} location`, "astronomy");
    return {
      latitude: geoLocation.latitude,
      longitude: geoLocation.longitude,
      formattedAddress: geoLocation.resolvedLocation,
      valid: geoLocation.valid
    };
  } catch (error) {
    log(`Error validating location: ${error}`, "astronomy");
    return {
      latitude: 0,
      longitude: 0,
      formattedAddress: locationString || "Unknown location",
      valid: false
    };
  }
}

function calculateHouses(julianDay: number, latitude: number, longitude: number): number[] {
  try {
    const housesResult = sweph.houses(julianDay, latitude, longitude, HOUSE_SYSTEM);
    if (housesResult && Array.isArray(housesResult.cusps)) {
      return housesResult.cusps;
    }

    // Fallback to mathematical approximation if sweph fails
    const T = (julianDay - 2451545.0) / 36525.0;
    const GMST = 280.46061837 + 360.98564736629 * (julianDay - 2451545.0) + 0.000387933 * T * T - T * T * T / 38710000.0;
    const ARMC = (GMST + longitude) % 360;

    return Array.from({ length: 13 }, (_, i) => (ARMC + (i * 30)) % 360);
  } catch (error) {
    log(`Error calculating houses: ${error}`, "astronomy");
    return Array.from({ length: 13 }, (_, i) => (i * 30) % 360);
  }
}

export async function calculatePlanetaryPositions(
  birthDate: string,
  birthTime: string = "12:00",
  birthLocation: string = ""
): Promise<ChartData> {
  try {
    const location = await validateLocation(birthLocation);
    log(`Location validation result: ${JSON.stringify(location)}`, "astronomy");

    const julianDay = getJulianDay(birthDate, birthTime, birthLocation);
    const houses = location.valid ? calculateHouses(julianDay, location.latitude, location.longitude) : undefined;

    const positions: PlanetPositions = {
      sun: { sign: "Unknown", degree: 0 },
      moon: { sign: "Unknown", degree: 0 },
      mercury: { sign: "Unknown", degree: 0 },
      venus: { sign: "Unknown", degree: 0 },
      mars: { sign: "Unknown", degree: 0 },
      jupiter: { sign: "Unknown", degree: 0 },
      saturn: { sign: "Unknown", degree: 0 },
      uranus: { sign: "Unknown", degree: 0 },
      neptune: { sign: "Unknown", degree: 0 },
      pluto: { sign: "Unknown", degree: 0 }
    };

    for (const [planetName, planetId] of Object.entries(PLANETS)) {
      try {
        const result = sweph.calc_ut(julianDay, planetId, SE_SWIEPH | SE_SPEED);
        if (!result) continue;

        let longitude = 0;
        let speed = 0;

        if (Array.isArray(result)) {
          longitude = result[0];
          speed = result[3] || 0;
        } else if (result.data && Array.isArray(result.data)) {
          longitude = result.data[0];
          speed = result.data[3] || 0;
        }

        longitude = ((longitude % 360) + 360) % 360;
        const { sign, degree } = longitudeToZodiacPosition(longitude);
        const key = planetName.toLowerCase();
        positions[key] = { sign, degree, retrograde: speed < 0 };

      } catch (error) {
        log(`Error calculating position for ${planetName}: ${error}`, "astronomy");
      }
    }

    let ascendant;
    if (location.valid && houses && houses.length > 0) {
      ascendant = longitudeToZodiacPosition(houses[0]);
    }

    return {
      ...positions,
      validLocation: location.valid,
      formattedLocation: location.formattedAddress,
      houses,
      ascendant: ascendant ? { sign: ascendant.sign, degree: ascendant.degree } : undefined
    };
  } catch (error) {
    log(`Error calculating planetary positions: ${error}`, "astronomy");
    return {
      sun: { sign: "Aries", degree: 0 },
      moon: { sign: "Taurus", degree: 0 },
      mercury: { sign: "Gemini", degree: 0 },
      venus: { sign: "Cancer", degree: 0 },
      mars: { sign: "Leo", degree: 0 },
      jupiter: { sign: "Virgo", degree: 0 },
      saturn: { sign: "Libra", degree: 0 },
      uranus: { sign: "Scorpio", degree: 0 },
      neptune: { sign: "Sagittarius", degree: 0 },
      pluto: { sign: "Capricorn", degree: 0 },
      validLocation: false,
      formattedLocation: birthLocation || "Unknown location"
    };
  }
}

export async function getZodiacSignFromDate(birthDate: string): Promise<string> {
  try {
    const positions = await calculatePlanetaryPositions(birthDate);
    return positions.sun.sign;
  } catch (error) {
    log(`Error determining zodiac sign: ${error}`, "astronomy");
    const date = new Date(birthDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";

    return "Unknown";
  }
}

export async function getCurrentPlanetaryPositions(): Promise<PlanetPositions> {
  const today = new Date().toISOString().split('T')[0];
  const planetPositions = await calculatePlanetaryPositions(today);
  const { sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto } = planetPositions;
  return { sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto };
}