/**
 * Cache Manager for Ephemeris Calculations
 * 
 * This module provides a caching layer for ephemeris calculations
 * using IndexedDB for client-side storage.
 */

import { ChartData, PlanetaryPosition } from './swiss-ephemeris';

// Cache key generator
const generateCacheKey = (
  type: string,
  birthDate: string,
  birthTime: string = "12:00",
  birthLocation: { latitude: number; longitude: number } = { latitude: 0, longitude: 0 }
): string => {
  return `${type}:${birthDate}:${birthTime}:${birthLocation.latitude},${birthLocation.longitude}`;
};

// IndexedDB database name and version
const DB_NAME = 'mystic-oracle-cache';
const DB_VERSION = 1;
const STORE_NAME = 'ephemeris-cache';

// Cache expiration time (7 days in milliseconds)
const CACHE_EXPIRATION = 7 * 24 * 60 * 60 * 1000;

export class EphemerisCache {
  private db: IDBDatabase | null = null;
  private dbPromise: Promise<IDBDatabase>;

  constructor() {
    this.dbPromise = this.initDatabase();
  }

  /**
   * Initialize the IndexedDB database
   */
  private initDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        console.error('Error opening IndexedDB:', event);
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object store for ephemeris cache
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  /**
   * Get cached data by key
   */
  async getCachedData<T>(key: string): Promise<T | null> {
    try {
      const db = await this.dbPromise;
      
      return new Promise<T | null>((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);
        
        request.onerror = () => {
          reject(new Error('Error reading from cache'));
        };
        
        request.onsuccess = () => {
          const result = request.result;
          
          if (!result) {
            resolve(null);
            return;
          }
          
          // Check if the cache entry has expired
          if (Date.now() - result.timestamp > CACHE_EXPIRATION) {
            // Delete expired entry
            this.deleteCachedData(key);
            resolve(null);
            return;
          }
          
          resolve(result.data as T);
        };
      });
    } catch (error) {
      console.error('Error accessing cache:', error);
      return null;
    }
  }

  /**
   * Store data in cache
   */
  async setCachedData<T>(key: string, data: T): Promise<void> {
    try {
      const db = await this.dbPromise;
      
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        const request = store.put({
          key,
          data,
          timestamp: Date.now()
        });
        
        request.onerror = () => {
          reject(new Error('Error writing to cache'));
        };
        
        request.onsuccess = () => {
          resolve();
        };
      });
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  }

  /**
   * Delete cached data by key
   */
  async deleteCachedData(key: string): Promise<void> {
    try {
      const db = await this.dbPromise;
      
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        const request = store.delete(key);
        
        request.onerror = () => {
          reject(new Error('Error deleting from cache'));
        };
        
        request.onsuccess = () => {
          resolve();
        };
      });
    } catch (error) {
      console.error('Error deleting from cache:', error);
    }
  }

  /**
   * Clear all cached data
   */
  async clearCache(): Promise<void> {
    try {
      const db = await this.dbPromise;
      
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        const request = store.clear();
        
        request.onerror = () => {
          reject(new Error('Error clearing cache'));
        };
        
        request.onsuccess = () => {
          resolve();
        };
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * Get cached planetary positions or calculate new ones
   */
  async getCachedPlanetaryPositions(
    calculateFn: (birthDate: string, birthTime: string, birthLocation: any) => Promise<Record<string, PlanetaryPosition>>,
    birthDate: string,
    birthTime: string = "12:00",
    birthLocation: { latitude: number; longitude: number } = { latitude: 0, longitude: 0 }
  ): Promise<Record<string, PlanetaryPosition>> {
    const cacheKey = generateCacheKey('positions', birthDate, birthTime, birthLocation);
    
    // Try to get from cache first
    const cachedData = await this.getCachedData<Record<string, PlanetaryPosition>>(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    // Calculate new data
    const positions = await calculateFn(birthDate, birthTime, birthLocation);
    
    // Cache the result
    await this.setCachedData(cacheKey, positions);
    
    return positions;
  }

  /**
   * Get cached birth chart or calculate a new one
   */
  async getCachedBirthChart(
    calculateFn: (birthDate: string, birthTime: string, birthLocation: any) => Promise<ChartData>,
    birthDate: string,
    birthTime: string = "12:00",
    birthLocation: { latitude: number; longitude: number } = { latitude: 0, longitude: 0 }
  ): Promise<ChartData> {
    const cacheKey = generateCacheKey('chart', birthDate, birthTime, birthLocation);
    
    // Try to get from cache first
    const cachedData = await this.getCachedData<ChartData>(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    
    // Calculate new data
    const chart = await calculateFn(birthDate, birthTime, birthLocation);
    
    // Cache the result
    await this.setCachedData(cacheKey, chart);
    
    return chart;
  }
}

// Create a singleton instance
const ephemerisCache = new EphemerisCache();

export default ephemerisCache;
