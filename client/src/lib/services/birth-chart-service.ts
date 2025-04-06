/**
 * Birth Chart Service
 * 
 * This service provides methods for calculating and interpreting birth charts.
 */

import ephemerisCalculator from '../ephemeris';
import { ChartData, PlanetaryPosition } from '../ephemeris/swiss-ephemeris';
import { apiRequest } from '../api';

export interface BirthChartFormData {
  name: string;
  birthDate: string;
  birthTime?: string;
  birthLocation?: string;
}

export interface BirthChartData {
  positions: Record<string, { sign: string; degree: number; retrograde?: boolean }>;
  validLocation: boolean;
  formattedLocation: string;
}

export interface BirthChart {
  id?: string;
  name: string;
  chartData: BirthChartData;
  interpretation: string;
  createdAt: Date;
}

/**
 * Calculate a birth chart using the ephemeris calculator
 */
export async function calculateBirthChart(formData: BirthChartFormData): Promise<BirthChartData> {
  try {
    // Parse location if provided
    let latitude = 0;
    let longitude = 0;
    let validLocation = false;
    let formattedLocation = 'Unknown location';
    
    if (formData.birthLocation) {
      try {
        // In a real implementation, we would use a geocoding service
        // For now, we'll just parse a simple format like "40.7128,-74.0060"
        if (formData.birthLocation.includes(',')) {
          const [lat, lng] = formData.birthLocation.split(',').map(parseFloat);
          if (!isNaN(lat) && !isNaN(lng)) {
            latitude = lat;
            longitude = lng;
            validLocation = true;
            formattedLocation = `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
          }
        } else {
          // Assume it's a place name
          formattedLocation = formData.birthLocation;
          validLocation = true;
        }
      } catch (error) {
        console.error('Error parsing location:', error);
      }
    }
    
    // Calculate planetary positions
    const birthLocation = { latitude, longitude };
    const positions = await ephemerisCalculator.calculatePlanetaryPositions(
      formData.birthDate,
      formData.birthTime,
      birthLocation
    );
    
    return {
      positions,
      validLocation,
      formattedLocation
    };
  } catch (error) {
    console.error('Error calculating birth chart:', error);
    throw new Error('Failed to calculate birth chart. Please try again.');
  }
}

/**
 * Generate an interpretation for a birth chart
 */
export async function generateBirthChartInterpretation(
  chartData: BirthChartData,
  isPremium: boolean = false
): Promise<string> {
  try {
    // For authenticated users, use the API to generate an interpretation
    if (isPremium) {
      const response = await apiRequest('/api/astrology-charts/interpret', {
        method: 'POST',
        body: JSON.stringify({ chartData })
      });
      
      return response.interpretation || '';
    }
    
    // For non-premium users, generate a basic interpretation
    return generateBasicInterpretation(chartData);
  } catch (error) {
    console.error('Error generating interpretation:', error);
    return generateBasicInterpretation(chartData);
  }
}

/**
 * Generate a basic interpretation for non-premium users
 */
function generateBasicInterpretation(chartData: BirthChartData): string {
  const { positions } = chartData;
  
  // Get sun and moon signs
  const sunSign = positions.sun?.sign || 'Unknown';
  const moonSign = positions.moon?.sign || 'Unknown';
  
  return `
Your Sun is in ${sunSign}, representing your core essence and conscious mind. This placement suggests ${getSunSignDescription(sunSign)}.

Your Moon is in ${moonSign}, reflecting your emotional nature and subconscious patterns. This placement indicates ${getMoonSignDescription(moonSign)}.

This is a basic interpretation of your birth chart. For a more detailed analysis including all planetary aspects, houses, and personalized insights, please upgrade to a premium account.
  `.trim();
}

/**
 * Get a description for a sun sign
 */
function getSunSignDescription(sign: string): string {
  const descriptions: Record<string, string> = {
    'Aries': 'a pioneering spirit, courage, and a natural leadership ability',
    'Taurus': 'stability, practicality, and a strong connection to the material world',
    'Gemini': 'versatility, curiosity, and excellent communication skills',
    'Cancer': 'emotional sensitivity, nurturing tendencies, and strong intuition',
    'Leo': 'creativity, generosity, and a natural flair for self-expression',
    'Virgo': 'analytical thinking, attention to detail, and a practical approach to life',
    'Libra': 'a diplomatic nature, appreciation for harmony, and social grace',
    'Scorpio': 'emotional intensity, psychological depth, and transformative power',
    'Sagittarius': 'optimism, philosophical thinking, and a love of adventure',
    'Capricorn': 'ambition, discipline, and a methodical approach to achieving goals',
    'Aquarius': 'originality, humanitarian values, and forward-thinking ideas',
    'Pisces': 'compassion, imagination, and spiritual sensitivity'
  };
  
  return descriptions[sign] || 'unique qualities that define your personality';
}

/**
 * Get a description for a moon sign
 */
function getMoonSignDescription(sign: string): string {
  const descriptions: Record<string, string> = {
    'Aries': 'emotional impulsiveness and a need for independence in your personal life',
    'Taurus': 'emotional stability and a need for security and comfort',
    'Gemini': 'emotional adaptability and a need for mental stimulation',
    'Cancer': 'deep emotional sensitivity and a strong connection to home and family',
    'Leo': 'emotional warmth and a need for recognition and appreciation',
    'Virgo': 'emotional discernment and a need for order and routine',
    'Libra': 'emotional balance and a need for harmony in relationships',
    'Scorpio': 'emotional intensity and a need for deep, transformative experiences',
    'Sagittarius': 'emotional optimism and a need for freedom and meaning',
    'Capricorn': 'emotional restraint and a need for achievement and structure',
    'Aquarius': 'emotional detachment and a need for intellectual freedom',
    'Pisces': 'emotional receptivity and a need for spiritual connection'
  };
  
  return descriptions[sign] || 'unique emotional patterns that shape your inner world';
}

/**
 * Create a birth chart with interpretation
 */
export async function createBirthChart(formData: BirthChartFormData, isPremium: boolean = false): Promise<BirthChart> {
  // Calculate the chart data
  const chartData = await calculateBirthChart(formData);
  
  // Generate an interpretation
  const interpretation = await generateBirthChartInterpretation(chartData, isPremium);
  
  // Create the birth chart object
  const birthChart: BirthChart = {
    name: formData.name,
    chartData,
    interpretation,
    createdAt: new Date()
  };
  
  return birthChart;
}
