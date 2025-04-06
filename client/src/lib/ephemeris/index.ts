/**
 * Ephemeris Calculation Facade
 * 
 * This module provides a unified interface for ephemeris calculations,
 * combining Swiss Ephemeris, caching, and Web Workers.
 */

import swissEphemeris, { ChartData, PlanetaryPosition } from './swiss-ephemeris';
import ephemerisCache from './cache-manager';

// Check if Web Workers are supported
const isWorkerSupported = typeof Worker !== 'undefined';

export class EphemerisCalculator {
  private worker: Worker | null = null;
  
  constructor() {
    // Initialize Web Worker if supported
    if (isWorkerSupported) {
      try {
        this.worker = new Worker('/workers/ephemeris-worker.js');
      } catch (error) {
        console.error('Failed to initialize Web Worker:', error);
      }
    }
  }
  
  /**
   * Calculate planetary positions with caching and fallbacks
   */
  async calculatePlanetaryPositions(
    birthDate: string,
    birthTime: string = "12:00",
    birthLocation: { latitude: number; longitude: number } = { latitude: 0, longitude: 0 }
  ): Promise<Record<string, PlanetaryPosition>> {
    try {
      // Try to get from cache first
      return await ephemerisCache.getCachedPlanetaryPositions(
        swissEphemeris.calculatePlanetaryPositions.bind(swissEphemeris),
        birthDate,
        birthTime,
        birthLocation
      );
    } catch (error) {
      console.error('Error calculating planetary positions:', error);
      
      // Fallback to direct calculation
      return swissEphemeris.calculatePlanetaryPositions(birthDate, birthTime, birthLocation);
    }
  }
  
  /**
   * Calculate a birth chart with caching and fallbacks
   */
  async calculateBirthChart(
    birthDate: string,
    birthTime: string = "12:00",
    birthLocation: { latitude: number; longitude: number } = { latitude: 0, longitude: 0 }
  ): Promise<ChartData> {
    try {
      // Try to get from cache first
      return await ephemerisCache.getCachedBirthChart(
        swissEphemeris.calculateBirthChart.bind(swissEphemeris),
        birthDate,
        birthTime,
        birthLocation
      );
    } catch (error) {
      console.error('Error calculating birth chart:', error);
      
      // Fallback to direct calculation
      return swissEphemeris.calculateBirthChart(birthDate, birthTime, birthLocation);
    }
  }
  
  /**
   * Calculate planetary positions using Web Worker
   */
  calculatePlanetaryPositionsWithWorker(
    birthDate: string,
    birthTime: string = "12:00",
    birthLocation: { latitude: number; longitude: number } = { latitude: 0, longitude: 0 }
  ): Promise<Record<string, PlanetaryPosition>> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        // Fallback to direct calculation if worker is not available
        swissEphemeris.calculatePlanetaryPositions(birthDate, birthTime, birthLocation)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      // Set up message handler
      const messageHandler = (event: MessageEvent) => {
        const { type, data } = event.data;
        
        if (type === 'planetaryPositions') {
          this.worker?.removeEventListener('message', messageHandler);
          resolve(data);
        } else if (type === 'error') {
          this.worker?.removeEventListener('message', messageHandler);
          reject(new Error(data.message));
        }
      };
      
      // Add message listener
      this.worker.addEventListener('message', messageHandler);
      
      // Send calculation request to worker
      this.worker.postMessage({
        type: 'calculatePlanetaryPositions',
        data: {
          birthDate,
          birthTime,
          birthLocation
        }
      });
    });
  }
  
  /**
   * Calculate a birth chart using Web Worker
   */
  calculateBirthChartWithWorker(
    birthDate: string,
    birthTime: string = "12:00",
    birthLocation: { latitude: number; longitude: number } = { latitude: 0, longitude: 0 }
  ): Promise<ChartData> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        // Fallback to direct calculation if worker is not available
        swissEphemeris.calculateBirthChart(birthDate, birthTime, birthLocation)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      // Set up message handler
      const messageHandler = (event: MessageEvent) => {
        const { type, data } = event.data;
        
        if (type === 'birthChart') {
          this.worker?.removeEventListener('message', messageHandler);
          resolve(data);
        } else if (type === 'error') {
          this.worker?.removeEventListener('message', messageHandler);
          reject(new Error(data.message));
        }
      };
      
      // Add message listener
      this.worker.addEventListener('message', messageHandler);
      
      // Send calculation request to worker
      this.worker.postMessage({
        type: 'calculateBirthChart',
        data: {
          birthDate,
          birthTime,
          birthLocation
        }
      });
    });
  }
  
  /**
   * Get the best available calculation method based on browser capabilities
   */
  async getBestCalculationMethod(): Promise<'worker' | 'direct'> {
    if (this.worker) {
      return 'worker';
    }
    return 'direct';
  }
  
  /**
   * Clear the ephemeris cache
   */
  async clearCache(): Promise<void> {
    return ephemerisCache.clearCache();
  }
}

// Create a singleton instance
const ephemerisCalculator = new EphemerisCalculator();

export default ephemerisCalculator;
