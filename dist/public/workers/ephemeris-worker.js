/**
 * Web Worker for Ephemeris Calculations
 * 
 * This worker offloads heavy ephemeris calculations from the main thread.
 */

// Mock zodiac signs for the worker implementation
const zodiacSigns = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 
  'Leo', 'Virgo', 'Libra', 'Scorpio', 
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Mock planets for the worker implementation
const planets = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
];

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'calculatePlanetaryPositions':
      const positions = calculatePlanetaryPositions(
        data.birthDate,
        data.birthTime,
        data.birthLocation
      );
      self.postMessage({ type: 'planetaryPositions', data: positions });
      break;
      
    case 'calculateBirthChart':
      const chart = calculateBirthChart(
        data.birthDate,
        data.birthTime,
        data.birthLocation
      );
      self.postMessage({ type: 'birthChart', data: chart });
      break;
      
    default:
      self.postMessage({ 
        type: 'error', 
        data: { message: `Unknown calculation type: ${type}` } 
      });
  }
});

/**
 * Calculate planetary positions
 */
function calculatePlanetaryPositions(birthDate, birthTime = "12:00", birthLocation = { latitude: 0, longitude: 0 }) {
  // Parse the birth date and time
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hour, minute] = birthTime.split(':').map(Number);
  
  // Create a date object
  const date = new Date(year, month - 1, day, hour, minute);
  
  // Calculate positions for each planet
  const positions = {};
  
  planets.forEach((planet, index) => {
    positions[planet.toLowerCase()] = mockPlanetPosition(planet, date, index);
  });
  
  return positions;
}

/**
 * Calculate a complete birth chart
 */
function calculateBirthChart(birthDate, birthTime = "12:00", birthLocation = { latitude: 0, longitude: 0 }) {
  // Calculate planetary positions
  const planets = calculatePlanetaryPositions(birthDate, birthTime, birthLocation);
  
  // Calculate houses
  const houses = mockHouses(birthDate, birthTime, birthLocation);
  
  // Calculate aspects
  const aspects = calculateAspects(planets);
  
  return {
    planets,
    houses,
    aspects
  };
}

/**
 * Mock a planetary position
 */
function mockPlanetPosition(planet, date, planetIndex) {
  // Use the date to generate a deterministic but seemingly random position
  const dayOfYear = getDayOfYear(date);
  
  // Generate a deterministic sign based on the planet and date
  const signIndex = (dayOfYear + planetIndex * 30) % 12;
  const sign = zodiacSigns[signIndex];
  
  // Generate a deterministic degree based on the planet and date
  const degree = (dayOfYear + planetIndex * 7) % 30;
  
  // Determine if the planet is retrograde
  const retrograde = ((dayOfYear + planetIndex) % 5) === 0;
  
  return {
    planet,
    sign,
    degree,
    retrograde
  };
}

/**
 * Mock houses based on the birth data
 */
function mockHouses(birthDate, birthTime, birthLocation) {
  // Parse the birth date and time
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hour, minute] = birthTime.split(':').map(Number);
  
  // Create a date object
  const date = new Date(year, month - 1, day, hour, minute);
  const dayOfYear = getDayOfYear(date);
  
  // Generate mock houses
  const houses = {};
  
  for (let i = 1; i <= 12; i++) {
    const signIndex = (dayOfYear + i * 30) % 12;
    const sign = zodiacSigns[signIndex];
    const degree = (dayOfYear + i * 7) % 30;
    
    houses[`house${i}`] = {
      sign,
      degree
    };
  }
  
  return houses;
}

/**
 * Calculate aspects between planets
 */
function calculateAspects(planets) {
  const aspects = [];
  
  // Define aspect types and their orbs
  const aspectTypes = [
    { name: 'Conjunction', angle: 0, orb: 8 },
    { name: 'Sextile', angle: 60, orb: 6 },
    { name: 'Square', angle: 90, orb: 8 },
    { name: 'Trine', angle: 120, orb: 8 },
    { name: 'Opposition', angle: 180, orb: 8 }
  ];
  
  // Get all planet keys
  const planetKeys = Object.keys(planets);
  
  // Calculate aspects between each pair of planets
  for (let i = 0; i < planetKeys.length; i++) {
    for (let j = i + 1; j < planetKeys.length; j++) {
      const planet1 = planetKeys[i];
      const planet2 = planetKeys[j];
      
      const position1 = getAbsoluteDegree(planets[planet1]);
      const position2 = getAbsoluteDegree(planets[planet2]);
      
      // Calculate the angle between the planets
      let angle = Math.abs(position1 - position2);
      if (angle > 180) angle = 360 - angle;
      
      // Check if the angle matches any aspect type
      for (const aspectType of aspectTypes) {
        const orb = Math.abs(angle - aspectType.angle);
        
        if (orb <= aspectType.orb) {
          aspects.push({
            planet1,
            planet2,
            aspect: aspectType.name,
            orb,
            applying: position1 < position2
          });
          break;
        }
      }
    }
  }
  
  return aspects;
}

/**
 * Convert a planetary position to an absolute degree in the zodiac (0-359)
 */
function getAbsoluteDegree(position) {
  const signIndex = zodiacSigns.indexOf(position.sign);
  return signIndex * 30 + position.degree;
}

/**
 * Get the day of the year (0-365)
 */
function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}
