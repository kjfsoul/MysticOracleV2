import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import * as portfinder from "portfinder";
import { registerRoutes } from "./routes";
import { log, serveStatic, setupVite } from "./vite";

const app = express();
const DEFAULT_PORT = 3001;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Port resolution with error handling
const resolvePort = async (): Promise<number> => {
  const basePort = parseInt(process.env.PORT || DEFAULT_PORT.toString(), 10);
  
  try {
    portfinder.setBasePort(basePort);
    const port = await portfinder.getPortPromise();
    if (port !== basePort) {
      log(`⚠️ Port ${basePort} in use, using ${port} instead`);
    }
    return port;
  } catch (err) {
    log(`⚠️ Port resolution failed (${err instanceof Error ? err.message : String(err)}), using ${DEFAULT_PORT}`);
    return DEFAULT_PORT;
  }
};

// Global error handler
const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  // Log error for debugging
  console.error(`[Error] ${status}: ${message}`);
  if (err.stack) console.error(err.stack);
  
  res.status(status).json({ message });
};

// Main application initialization
const initializeApp = async () => {
  try {
    const server = await registerRoutes(app);
    
    // Error handling middleware
    app.use(errorHandler);
    
    // Setup environment-specific middleware
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
    
    const port = await resolvePort();
    server.listen(port, () => {
      console.log(`
🚀 Server started successfully
📡 Mode: ${app.get("env")}
🌐 URL: http://localhost:${port}
      `);
    });
    
    // Handle graceful shutdown
    const shutdown = () => {
      console.log("\n👋 Shutting down gracefully...");
      server.close(() => {
        console.log("✅ Server closed successfully");
        process.exit(0);
      });
    };
    
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
    
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

initializeApp();

export default app;
