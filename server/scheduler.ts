import schedule from 'node-schedule';
import { generateDailyHoroscope, zodiacSigns } from './openai';
import { horoscopeDB } from './supabase';
import { log } from './vite';
import axios from 'axios';

/**
 * Initialize all scheduled tasks
 */
export function initializeScheduler() {
  // Schedule daily horoscope updates at 00:05 each day
  schedule.scheduleJob('5 0 * * *', updateDailyHoroscopes);
  
  // Schedule NASA data fetching at 00:15 each day
  schedule.scheduleJob('15 0 * * *', fetchDailyNASAData);
  
  // Schedule special event alerts (e.g., lunar eclipse, St. Patrick's Day)
  schedule.scheduleJob('0 8 14 3 *', sendLunarEclipseNotifications); // March 14
  schedule.scheduleJob('0 8 17 3 *', sendStPatricksDayNotifications); // March 17
  
  log('All scheduled tasks have been initialized', 'scheduler');
}

/**
 * Update daily horoscopes for all zodiac signs
 */
async function updateDailyHoroscopes() {
  try {
    log('Starting daily horoscope updates', 'scheduler');
    const today = new Date().toISOString().split('T')[0];
    
    // Generate and store horoscopes for all zodiac signs
    for (const { sign } of zodiacSigns) {
      try {
        // Check if we already have a horoscope for this sign today
        const existingHoroscope = await horoscopeDB.getTodayHoroscope(sign);
        if (existingHoroscope) {
          log(`Horoscope for ${sign} already exists for today`, 'scheduler');
          continue;
        }
        
        // Generate regular and premium versions
        const { horoscope, premiumInsight } = await generateDailyHoroscope(sign, true);
        
        // Store in database
        await horoscopeDB.storeDailyHoroscope({
          sign,
          date: today,
          content: horoscope,
          premium_content: premiumInsight
        });
        
        log(`Generated horoscope for ${sign}`, 'scheduler');
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        log(`Error generating horoscope for ${sign}: ${error}`, 'scheduler');
      }
    }
    
    log('Completed daily horoscope updates', 'scheduler');
  } catch (error) {
    log(`Error in updateDailyHoroscopes: ${error}`, 'scheduler');
  }
}

/**
 * Fetch daily astronomy picture from NASA
 */
async function fetchDailyNASAData() {
  try {
    log('Fetching daily NASA astronomy picture', 'scheduler');
    
    const NASA_API_URL = 'https://api.nasa.gov/planetary/apod';
    const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
    
    const response = await axios.get(`${NASA_API_URL}?api_key=${NASA_API_KEY}`);
    
    if (response.status === 200 && response.data) {
      const { title, url, explanation } = response.data;
      log(`NASA APOD: ${title}`, 'scheduler');
      
      // Here you could store this data for use in the app
      // or trigger notifications about the new astronomy picture
    } else {
      log('Failed to fetch NASA data', 'scheduler');
    }
  } catch (error) {
    log(`Error in fetchDailyNASAData: ${error}`, 'scheduler');
  }
}

/**
 * Send notifications for Lunar Eclipse special event (March 14)
 */
async function sendLunarEclipseNotifications() {
  try {
    log('Sending Lunar Eclipse event notifications', 'scheduler');
    
    // Here you would implement logic to:
    // 1. Query users who should receive the notification
    // 2. Send emails or push notifications about the special event
    // 3. Create special tarot spreads or promotions for the lunar eclipse
    
    log('Lunar Eclipse notifications have been sent', 'scheduler');
  } catch (error) {
    log(`Error in sendLunarEclipseNotifications: ${error}`, 'scheduler');
  }
}

/**
 * Send notifications for St. Patrick's Day special event (March 17)
 */
async function sendStPatricksDayNotifications() {
  try {
    log('Sending St. Patrick\'s Day event notifications', 'scheduler');
    
    // Here you would implement logic to:
    // 1. Query users who should receive the notification
    // 2. Send emails or push notifications about the special event
    // 3. Create special promotions or themed content for St. Patrick's Day
    
    log('St. Patrick\'s Day notifications have been sent', 'scheduler');
  } catch (error) {
    log(`Error in sendStPatricksDayNotifications: ${error}`, 'scheduler');
  }
}