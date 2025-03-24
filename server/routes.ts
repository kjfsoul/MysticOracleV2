import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { 
  insertTarotReadingSchema, 
  insertAstrologyChartSchema 
} from "@shared/schema";
import { 
  getRandomCards, 
  getRandomCard,
  generateTarotReading, 
  getSpread,
  generateDailyHoroscope,
  generateCompatibilityReading,
  generateBirthChartInterpretation,
  getBasicInterpretation,
  zodiacSigns,
  generateZodiacSpread
} from "./openai";
import { PLAN_DETAILS } from "./stripe-mock";
import { horoscopeDB, astrologyDB } from "./supabase-mock";
import { calculatePlanetaryPositions, getZodiacSignFromDate } from "./astronomy";
// import { initializeScheduler } from "./scheduler";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Direct testing route for authentication debugging
  app.get("/api/auth-test", (req, res) => {
    console.log("DEBUG - Auth Test Route - Session ID:", req.sessionID);
    console.log("DEBUG - Auth Test Route - Is Authenticated:", req.isAuthenticated());
    console.log("DEBUG - Auth Test Route - User:", req.user);
    console.log("DEBUG - Auth Test Route - Session:", req.session);
    console.log("DEBUG - Auth Test Route - Cookies:", req.headers.cookie);

    // Add direct login link for easy testing
    const loginLink = `<a href="/api/direct-login-test?returnTo=${encodeURIComponent(req.query.returnTo || '/debug-auth')}">Click here to login as test user</a>`;

    if (req.isAuthenticated()) {
      if (req.headers.accept?.includes("text/html")) {
        return res.send(`
          <h1>Authentication Status: Authenticated</h1>
          <p>User: ${JSON.stringify(req.user)}</p>
          <p>Session ID: ${req.sessionID}</p>
          <p><a href="/api/logout">Logout</a></p>
        `);
      }

      return res.json({
        status: "authenticated",
        user: req.user,
        sessionID: req.sessionID
      });
    } else {
      if (req.headers.accept?.includes("text/html")) {
        return res.send(`
          <h1>Authentication Status: Not Authenticated</h1>
          <p>Session ID: ${req.sessionID}</p>
          <p>${loginLink}</p>
        `);
      }

      return res.status(401).json({
        status: "unauthenticated", 
        message: "Not logged in",
        sessionID: req.sessionID,
        loginUrl: "/api/direct-login-test"
      });
    }
  });

  // Direct login test route
  app.get("/api/direct-login-test", (req, res) => {
    const username = "newuser";
    const password = "password123";

    console.log("DEBUG - Direct Login Test - Attempting login for:", username);

    // Get the return URL from query params or default to debug page
    const returnTo = req.query.returnTo as string || "/debug-auth";

    // Use passport directly
    req.login({
      id: 999,
      username: username,
      email: "newuser@example.com",
      birthDate: null,
      createdAt: new Date(),
      profileImage: null,
      subscriptionLevel: "basic"
    }, (err) => {
      if (err) {
        console.error("DEBUG - Direct Login Test - Login error:", err);

        // If this is a browser request, redirect with error
        if (req.headers.accept?.includes("text/html")) {
          return res.redirect(`/debug-auth?error=${encodeURIComponent("Login failed: " + err.message)}`);
        }

        // Otherwise return JSON error
        return res.status(500).json({ 
          status: "error", 
          message: "Login failed",
          error: err.message
        });
      }

      console.log("DEBUG - Direct Login Test - Login successful");
      console.log("DEBUG - Direct Login Test - Session:", req.session);
      console.log("DEBUG - Direct Login Test - User:", req.user);

      // If this is a browser request, redirect back
      if (req.headers.accept?.includes("text/html")) {
        return res.redirect(returnTo);
      }

      // Otherwise return JSON response
      res.json({ 
        status: "success", 
        message: "Login successful",
        user: req.user,
        sessionID: req.sessionID
      });
    });
  });

  // ===== Tarot Reading Routes =====

  // Public tarot data endpoint - doesn't require authentication
  app.get("/api/tarot-data", async (req, res) => {
    try {
      // Return information about available tarot data
      res.json({ 
        success: true, 
        spreads: [
          { id: "single", name: "Single Card", description: "A simple one-card reading for quick guidance", cardCount: 1 },
          { id: "past-present-future", name: "Past-Present-Future", description: "Three-card spread showing your journey's timeline", cardCount: 3 },
          { id: "celtic-cross", name: "Celtic Cross", description: "Comprehensive ten-card spread for deep insight", cardCount: 10 },
          { id: "zodiac-spread", name: "Zodiac Spread", description: "Twelve-card spread based on the houses of the zodiac, combining tarot and astrology", cardCount: 12 }
        ]
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tarot data" });
    }
  });

  // Public endpoint to get random tarot cards - doesn't require authentication
  app.get("/api/tarot-cards/random", async (req, res) => {
    try {
      // Get count parameter from query or default to 1
      const count = req.query.count ? parseInt(req.query.count as string) : 1;

      // Use the maximum of count and 1 (for safety), and minimum of count and 10 (to limit)
      const safeCount = Math.max(1, Math.min(count, 10));

      // Get random cards
      const cards = getRandomCards(safeCount);

      res.json({ 
        success: true,
        cards
      });
    } catch (error) {
      console.error("Error getting random tarot cards:", error);
      res.status(500).json({ message: "Failed to get random tarot cards" });
    }
  });

  // Card of the Day endpoint - doesn't require authentication
  app.get("/api/tarot-cards/card-of-the-day", async (req, res) => {
    try {
      // Get a single random card
      const card = getRandomCard();

      // Get basic interpretation for this card
      const interpretation = getBasicInterpretation(card);

      // Create response
      const cardOfDay = {
        success: true,
        card,
        interpretation,
        date: new Date().toISOString().split('T')[0],
        message: "Sign up for a premium account to receive personalized readings and deeper insights!"
      };

      res.json(cardOfDay);
    } catch (error) {
      console.error("Error getting card of the day:", error);
      res.status(500).json({ message: "Failed to get card of the day" });
    }
  });

  // Public endpoint to generate a tarot reading (no authentication required)
  app.post("/api/public/tarot-readings", async (req, res) => {    
      try {
          const { spread, question } = req.body;

          // Validate spread
          const spreadConfig = getSpread(spread);
          if (!spreadConfig) {
              return res.status(400).json({ message: "Invalid spread type" });
          }

          // Get random cards for the spread
          const cards = getRandomCards(spreadConfig.cardCount);

          // Generate interpretation using OpenAI, without premium insight for public users
          const { interpretation, aiInsight } = await generateTarotReading(cards, question, spread, false);

          // Create a simple reading without saving to DB
          const reading = {
              id: Date.now(), // Use timestamp as ID
              userId: 0, // Public user
              spread,
              question: question || null,
              cards,
              interpretation,
              aiInsight: null, // No AI insight for public readings
              isSaved: false,
              createdAt: new Date()
          };

          res.status(201).json(reading);
      } catch (error) {
          console.error("Error creating public tarot reading:", error);
          res.status(500).json({ message: "Failed to create reading" });
      }
  });

  // Get user's tarot readings
  app.get("/api/tarot-readings", async (req, res) => {
      if (!req.isAuthenticated()) {
          console.log("User not authenticated for tarot-readings endpoint");
          return res.status(401).json({ 
              message: "Please log in to view your tarot readings",
              code: "AUTH_REQUIRED",
              requiresAuth: true
          });
      }

      try {
          console.log(`Fetching tarot readings for user ID: ${req.user.id}`);
          const readings = await storage.getTarotReadings(req.user.id);
          console.log(`Found ${readings.length} readings`);
          res.json(readings);
      } catch (error) {
          console.error("Error fetching tarot readings:", error);
          res.status(500).json({ 
              message: "Failed to fetch readings",
              code: "SERVER_ERROR"
          });
      }
  });

  // Get specific tarot reading
  app.get("/api/tarot-readings/:id", async (req, res) => {
      if (!req.isAuthenticated()) {
          return res.status(401).json({ message: "Not authenticated" });
      }

      try {
          const readingId = parseInt(req.params.id);
          const reading = await storage.getTarotReading(readingId);

          if (!reading) {
              return res.status(404).json({ message: "Reading not found" });
          }

          if (reading.userId !== req.user.id) {
              return res.status(403).json({ message: "Access denied" });
          }

          res.json(reading);
      } catch (error) {
          res.status(500).json({ message: "Failed to fetch reading" });
      }
  });

  // Generate a new tarot reading
  app.post("/api/tarot-readings", async (req, res) => {
      if (!req.isAuthenticated()) {
          return res.status(401).json({ message: "Not authenticated" });
      }

      try {
          const { spread, question } = req.body;

          // Validate spread
          const spreadConfig = getSpread(spread);
          if (!spreadConfig) {
              return res.status(400).json({ message: "Invalid spread type" });
          }

          // Get random cards for the spread
          const cards = getRandomCards(spreadConfig.cardCount);

          // Generate interpretation using OpenAI
          const { interpretation, aiInsight } = await generateTarotReading(cards, question, spread);

          // Create reading in database
          const reading = await storage.createTarotReading({
              userId: req.user.id,
              spread,
              question: question || null,
              cards,
              interpretation,
              aiInsight,
              isSaved: false
          });

          res.status(201).json(reading);
      } catch (error) {
          if (error instanceof ZodError) {
              const validationError = fromZodError(error);
              return res.status(400).json({ message: validationError.message });
          }

          console.error("Error creating tarot reading:", error);
          res.status(500).json({ message: "Failed to create reading" });
      }
  });

  // Save/unsave a tarot reading
  app.patch("/api/tarot-readings/:id/save", async (req, res) => {
      if (!req.isAuthenticated()) {
          return res.status(401).json({ message: "Not authenticated" });
      }

      try {
          const readingId = parseInt(req.params.id);
          const { isSaved } = req.body;

          if (typeof isSaved !== "boolean") {
              return res.status(400).json({ message: "isSaved must be a boolean" });
          }

          const reading = await storage.getTarotReading(readingId);

          if (!reading) {
              return res.status(404).json({ message: "Reading not found" });
          }

          if (reading.userId !== req.user.id) {
              return res.status(403).json({ message: "Access denied" });
          }

          const updatedReading = await storage.saveTarotReading(readingId, isSaved);
          res.json(updatedReading);
      } catch (error) {
          res.status(500).json({ message: "Failed to update reading" });
      }
  });

  // Generate a zodiac spread (combines tarot with astrology)
  app.post("/api/tarot-readings/zodiac-spread", async (req, res) => {
      // Temporarily disable authentication for testing
      // if (!req.isAuthenticated()) {
      //     return res.status(401).json({ message: "Not authenticated" });
      // }
      
      // Set a default user for unauthenticated requests
      if (!req.isAuthenticated()) {
          req.user = {
              id: 999,
              username: "guest_user",
              email: "guest@example.com",
              subscriptionLevel: "free"
          };
      }

      try {
          const { birthDate, birthTime, birthLocation, question } = req.body;
          const isPremium = req.user.subscriptionLevel === "premium";

          // Validate required fields
          if (!birthDate) {
              return res.status(400).json({ message: "Birth date is required" });
          }

          if (!birthLocation) {
              return res.status(400).json({ message: "Birth location is required" });
          }

          // Calculate planetary positions for the birth data
          const chartData = await calculatePlanetaryPositions(birthDate, birthTime || "12:00", birthLocation);
          
          // Generate zodiac spread using the planetary positions
          const cards = await generateZodiacSpread(chartData, isPremium);
          
          // Generate interpretation using OpenAI
          const { interpretation, aiInsight } = await generateTarotReading(
              cards, 
              question, 
              "zodiac-spread", 
              isPremium
          );

          // Create reading in database
          const reading = await storage.createTarotReading({
              userId: req.user.id,
              spread: "zodiac-spread",
              question: question || null,
              cards,
              interpretation,
              aiInsight: isPremium ? aiInsight : null,
              isSaved: false
          });

          res.status(201).json({
              success: true,
              reading,
              message: "Zodiac spread created successfully"
          });
      } catch (error) {
          console.error("Error creating zodiac spread:", error);
          
          if (error instanceof ZodError) {
              const validationError = fromZodError(error);
              return res.status(400).json({ message: validationError.message });
          }
          
          res.status(500).json({ 
              success: false,
              message: "Failed to create zodiac spread" 
          });
      }
  });

  // Public endpoint for birth chart calculations (no authentication required)
  app.post("/api/public/birth-chart", async (req, res) => {
    try {
      const { birthDate, birthTime, birthLocation } = req.body;
      
      // Validate required fields
      if (!birthDate) {
        return res.status(400).json({ message: "Birth date is required" });
      }

      if (!birthLocation) {
        return res.status(400).json({ message: "Birth location is required" });
      }
      
      // Calculate planetary positions for the birth data
      const chartData = await calculatePlanetaryPositions(birthDate, birthTime || "12:00", birthLocation);
      
      // For charts not associated with a user, we don't save them
      // Generate a basic interpretation for the chart
      const interpretation = await generateBirthChartInterpretation(chartData, false);
      
      res.status(200).json({
        success: true,
        chart: {
          id: `preview-${Date.now()}`,
          chartType: "birth-chart",
          chartData,
          interpretation,
          date: birthDate,
          time: birthTime || "12:00",
          location: birthLocation || "Unknown",
          createdAt: new Date().toISOString()
        },
        message: "Birth chart generated successfully"
      });
    } catch (error) {
      console.error("Error generating birth chart:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      res.status(500).json({
        success: false,
        message: "Failed to generate birth chart"
      });
    }
  });

  // Public endpoint for zodiac spread preview (no authentication required)
  app.post("/api/public/zodiac-spread", async (req, res) => {
      try {
          const { birthDate, birthTime, birthLocation, question } = req.body;
          
          // Validate required fields
          if (!birthDate) {
              return res.status(400).json({ message: "Birth date is required" });
          }

          if (!birthLocation) {
              return res.status(400).json({ message: "Birth location is required" });
          }
          
          // Calculate planetary positions for the birth data
          const chartData = await calculatePlanetaryPositions(birthDate, birthTime || "12:00", birthLocation);
          
          // Generate a simplified zodiac spread (non-premium)
          const cards = await generateZodiacSpread(chartData, false);
          
          // Generate basic interpretation
          const { interpretation } = await generateTarotReading(cards, question, "zodiac-spread", false);
          
          // Create a preview reading (not saved to database)
          const reading = {
              id: `preview-${Date.now()}`,
              spread: "zodiac-spread",
              question: question || null,
              cards,
              interpretation,
              aiInsight: null, // No premium insights for public endpoint
              createdAt: new Date().toISOString(),
              message: "Sign up for a premium account to save this reading and get deeper insights!"
          };
          
          res.status(200).json({
              success: true,
              reading,
              message: "Zodiac spread preview generated successfully"
          });
      } catch (error) {
          console.error("Error creating public zodiac spread:", error);
          res.status(500).json({ 
              success: false, 
              message: "Failed to create zodiac spread preview" 
          });
      }
  });

  // ===== Astrology Chart Routes =====

  // Get user's astrology charts
  app.get("/api/astrology-charts", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const charts = await storage.getAstrologyCharts(req.user.id);
      res.json(charts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch charts" });
    }
  });

  // Get specific astrology chart
  app.get("/api/astrology-charts/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const chartId = parseInt(req.params.id);
      const chart = await storage.getAstrologyChart(chartId);

      if (!chart) {
        return res.status(404).json({ message: "Chart not found" });
      }

      if (chart.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(chart);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chart" });
    }
  });

  // We consolidated this with the other birth chart endpoint

  // Create a new birth chart
  app.post("/api/astrology-charts/birth-chart", async (req, res) => {
    // Temporarily disable authentication requirement for testing
    // if (!req.isAuthenticated()) {
    //   return res.status(401).json({ message: "Not authenticated" });
    // }
    // Set a mock user for unauthenticated requests
    if (!req.isAuthenticated()) {
      req.user = { 
        id: 999,
        username: "guest_user",
        email: "guest@example.com",
        subscriptionLevel: "free"
      };
    }

    try {
      const { birthDate, birthTime, birthLocation, name } = req.body;

      // Detailed validation with specific error messages
      const validationErrors = [];

      if (!name || typeof name !== 'string' || name.trim().length < 2) {
        validationErrors.push("Name is required and must be at least 2 characters");
      }

      if (!birthDate) {
        validationErrors.push("Birth date is required");
      } else {
        // Validate date format
        const dateObj = new Date(birthDate);
        if (isNaN(dateObj.getTime())) {
          validationErrors.push("Invalid birth date format");
        }
      }

      if (!birthLocation || typeof birthLocation !== 'string' || birthLocation.trim().length < 2) {
        validationErrors.push("Birth location is required and must be at least 2 characters");
      }

      if (validationErrors.length > 0) {
        return res.status(400).json({ 
          success: false,
          message: "Validation errors",
          errors: validationErrors
        });
      }

      // Log the request for debugging
      console.log(`Creating birth chart for ${name} born on ${birthDate} at ${birthTime || "unknown time"} in ${birthLocation}`);

      // Calculate accurate planetary positions using Swiss Ephemeris
      const positions = await calculatePlanetaryPositions(birthDate, birthTime || "12:00", birthLocation);

      const chartData = {
        name: name.trim(),
        subject: req.user.username,
        date: birthDate,
        time: birthTime || "12:00",
        location: birthLocation.trim(),
        positions
      };

      try {
        // Generate interpretation with OpenAI
        const interpretation = await generateBirthChartInterpretation(chartData);

        if (interpretation.startsWith("Error:")) {
          throw new Error(interpretation);
        }

        try {
          // Create chart in database
          const chart = await storage.createAstrologyChart({
            userId: req.user.id,
            chartType: 'birth-chart',
            chartData,
            interpretation
          });

          if (!chart) {
            throw new Error("Failed to save chart to database");
          }

          console.log(`Birth chart created successfully for ${name}`);

          res.status(201).json({
            success: true,
            data: chart,
            message: "Birth chart created successfully"
          });
        } catch (dbError) {
          console.error("Database error:", dbError);
          throw new Error("Failed to save chart to database");
        }
      } catch (error) {
        if (error instanceof ZodError) {
          const validationError = fromZodError(error);
          return res.status(400).json({ 
            success: false,
            message: validationError.message,
            error: "VALIDATION_ERROR"
          });
        }

        console.error("Error creating birth chart:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        // Send specific error responses
        if (errorMessage.includes("database") || errorMessage.includes("storage")) {
          return res.status(500).json({ 
            success: false,
            message: "Failed to save your birth chart",
            error: "DATABASE_ERROR"
          });
        } else if (errorMessage.includes("positions")) {
          return res.status(400).json({
            success: false,
            message: "Invalid birth date or location format",
            error: "CALCULATION_ERROR"
          });
        } else if (errorMessage.includes("OpenAI") || errorMessage.includes("interpretation")) {
          return res.status(503).json({ 
            success: false,
            message: "Interpretation service temporarily unavailable",
            error: "SERVICE_UNAVAILABLE"
          });
        } else {
          res.status(500).json({ 
            success: false,
            message: errorMessage || "Unable to process birth chart request",
            error: "INTERNAL_ERROR"
          });
        }
      }
    } catch (outerError) {
      console.error("Outer error in birth chart creation:", outerError);
      res.status(500).json({
        success: false,
        message: "An unexpected error occurred",
        error: "INTERNAL_ERROR"
      });
    }
  });

  // ===== Daily Horoscope Routes =====

  // Public horoscope preview - doesn't require authentication
  app.get("/api/horoscopes/preview/:sign", async (req, res) => {
    try {
      const sign = req.params.sign.toLowerCase();

      // Check if sign is valid
      if (!zodiacSigns.some(z => z.sign.toLowerCase() === sign)) {
        return res.status(400).json({ message: "Invalid zodiac sign" });
      }

      // Get today's horoscope for the sign
      const horoscope = await horoscopeDB.getTodayHoroscope(sign);

      // If horoscope doesn't exist yet, generate it on-demand
      if (!horoscope) {
        // Generate without premium insights for preview
        const { horoscope: content } = await generateDailyHoroscope(sign, false);

        const today = new Date().toISOString().split('T')[0];

        // Create preview response that mirrors the structure of authenticated response
        const previewHoroscope = {
          sign,
          date: today,
          content: content.substring(0, 150) + "...", // Show only the first part of the horoscope
          message: "Sign up for full daily horoscopes and personalized insights!",
          // Include these fields to match authenticated response structure
          id: `preview-${Date.now()}`,
          created_at: new Date().toISOString()
        };

        return res.json(previewHoroscope);
      }

      // Return limited preview from existing horoscope that mirrors authenticated response
      const previewHoroscope = {
        id: `preview-${horoscope.id || Date.now()}`,
        sign,
        date: horoscope.date,
        content: horoscope.content.substring(0, 150) + "...", // Show only the first part
        created_at: horoscope.created_at || new Date().toISOString(),
        message: "Sign up for full daily horoscopes and personalized insights!"
      };

      res.json(previewHoroscope);
    } catch (error) {
      console.error("Error fetching horoscope preview:", error);
      res.status(500).json({ message: "Failed to fetch horoscope preview" });
    }
  });

  // Get today's horoscope for a specific sign
  app.get("/api/horoscopes/:sign", async (req, res) => {
    try {
      const sign = req.params.sign.toLowerCase();

      // Check if sign is valid
      if (!zodiacSigns.some(z => z.sign.toLowerCase() === sign)) {
        return res.status(400).json({ message: "Invalid zodiac sign" });
      }

      // Get today's horoscope for the sign
      const horoscope = await horoscopeDB.getTodayHoroscope(sign);

      // Check authentication status
      const isAuthenticated = req.isAuthenticated();
      const isPremium = isAuthenticated && req.user.subscriptionLevel === 'pro';

      // If horoscope doesn't exist yet, generate it on-demand
      if (!horoscope) {
        console.log(`Generating new horoscope for ${sign}. User authenticated: ${isAuthenticated}`);
        const { horoscope: content, premiumInsight } = await generateDailyHoroscope(sign, isPremium);

        const today = new Date().toISOString().split('T')[0];

        // Store in database for future requests
        const newHoroscope = await horoscopeDB.storeDailyHoroscope({
          sign,
          date: today,
          content,
          premium_content: premiumInsight
        });

        // If user is not on premium tier, don't send premium content
        if (!isPremium) {
          delete newHoroscope.premium_content;
        }

        return res.json(newHoroscope);
      }

      // If user is not on premium tier or not authenticated, don't send premium content
      if (!isPremium) {
        delete horoscope.premium_content;
      }

      console.log(`Returning horoscope for ${sign}. User authenticated: ${isAuthenticated}`);
      res.json(horoscope);
    } catch (error) {
      console.error("Error fetching horoscope:", error);
      res.status(500).json({ message: "Failed to fetch horoscope" });
    }
  });

  // ===== Compatibility Routes =====

  // Get compatibility reading for two signs
  app.get("/api/compatibility/:sign1/:sign2", async (req, res) => {
    try {
      const sign1 = req.params.sign1.toLowerCase();
      const sign2 = req.params.sign2.toLowerCase();

      // Check if signs are valid
      if (!zodiacSigns.some(z => z.sign.toLowerCase() === sign1) || 
          !zodiacSigns.some(z => z.sign.toLowerCase() === sign2)) {
        return res.status(400).json({ message: "Invalid zodiac sign(s)" });
      }

      // Generate compatibility reading
      const content = await generateCompatibilityReading(sign1, sign2);

      // Store reading in database if user is authenticated
      if (req.isAuthenticated()) {
        // Here you would store the compatibility reading in the database
        // For now, we'll just return the content
      }

      res.json({ sign1, sign2, content });
    } catch (error) {
      console.error("Error generating compatibility reading:", error);
      res.status(500).json({ message: "Failed to generate compatibility reading" });
    }
  });

  // ===== Subscription Routes =====

  // Get subscription plans
  app.get("/api/subscription/plans", (req, res) => {
    res.json(PLAN_DETAILS);
  });

  // Create checkout session
  app.post("/api/subscription/checkout", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const { planId } = req.body;

      if (!planId) {
        return res.status(400).json({ message: "Plan ID is required" });
      }

      // Mock checkout session response
      res.json({ 
        sessionId: "mock_session_" + Date.now(),
        url: "https://checkout.stripe.com/mock-checkout"
      });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });

  // Handle successful subscription
  app.get("/api/subscription/success", async (req, res) => {
    try {
      const { session_id } = req.query;

      if (!session_id) {
        return res.status(400).json({ message: "Session ID is required" });
      }

      // Mock successful subscription
      res.json({
        id: 1,
        user_id: req.isAuthenticated() ? req.user.id : 1,
        stripe_customer_id: "cus_mock",
        stripe_subscription_id: "sub_mock",
        plan_id: "price_basic",
        status: "active",
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error handling subscription success:", error);
      res.status(500).json({ message: "Failed to handle subscription" });
    }
  });

  // Cancel subscription
  app.post("/api/subscription/cancel", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const { subscriptionId } = req.body;

      if (!subscriptionId) {
        return res.status(400).json({ message: "Subscription ID is required" });
      }

      // Mock cancel subscription response
      res.json({
        id: 1,
        user_id: req.user.id,
        stripe_subscription_id: subscriptionId,
        status: "canceled",
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error canceling subscription:", error);
      res.status(500).json({ message: "Failed to cancel subscription" });
    }
  });

  // Get current subscription status
  app.get("/api/subscription/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      // Mock subscription status
      res.json({ 
        isActive: true, 
        isPro: req.user.username === "premium_user", 
        plan: req.user.username === "premium_user" ? "pro" : "basic" 
      });
    } catch (error) {
      console.error("Error checking subscription status:", error);
      res.status(500).json({ message: "Failed to check subscription status" });
    }
  });

  // Stripe API endpoints
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { planId } = req.body;
      const { userId, email } = req.user!;

      const { sessionId, url } = await createCheckoutSession(userId, email, planId);
      res.json({ sessionId, url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    } finally {
      // Cleanup if needed
    }
  });

  app.get("/api/subscription/success", async (req, res) => {
    try {
      const { session_id } = req.query;
      if (!session_id || typeof session_id !== "string") {
        return res.status(400).json({ error: "Missing session ID" });
      }

      const subscription = await handleSuccessfulSubscription(session_id);
      res.json({ success: true, subscription });
    } catch (error) {
      console.error("Error handling subscription success:", error);
      res.status(500).json({ error: "Failed to process subscription" });
    }
  });

  app.get("/api/subscription/status", async (req, res) => {
    try {
      const { userId } = req.user!;
      const status = await checkSubscriptionStatus(userId);
      res.json(status);
    } catch (error) {
      console.error("Error checking subscription status:", error);
      res.status(500).json({ error: "Failed to check subscription status" });
    }
  });


  // We're not initializing the scheduler in development mode
  // initializeScheduler();

  // Test endpoint for geocoding a location
  app.get("/api/test/geocode", async (req, res) => {
    try {
      const location = req.query.location as string;
      
      if (!location) {
        return res.status(400).json({
          success: false,
          message: "Location parameter is required"
        });
      }
      
      // Import geocoding directly to test it
      const { geocodeLocation } = await import('./geocoding');
      const geoData = await geocodeLocation(location);
      
      res.json({
        success: true,
        location: geoData,
        message: "Geocoding test completed"
      });
    } catch (error) {
      console.error("Error in geocoding test:", error);
      res.status(500).json({
        success: false,
        message: "Geocoding test failed",
        error: error.message
      });
    }
  });
  
  // Test endpoint for astronomical calculations
  app.get("/api/test/astronomy", async (req, res) => {
    try {
      const date = req.query.date as string || new Date().toISOString().split('T')[0];
      const time = req.query.time as string || "12:00";
      const location = req.query.location as string || "New York, NY";
      
      // Calculate planetary positions with detailed logging
      const positions = await calculatePlanetaryPositions(date, time, location);
      
      // Determine zodiac sign from date
      const sunSign = await getZodiacSignFromDate(date);
      
      res.json({
        success: true,
        date: date,
        time: time,
        location: location,
        sun_sign: sunSign,
        chart_data: positions,
        message: "Astronomy calculations completed successfully"
      });
    } catch (error) {
      console.error("Error in astronomy test:", error);
      res.status(500).json({
        success: false,
        message: "Astronomy test failed",
        error: error.message
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}