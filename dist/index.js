// server/index.ts
import "dotenv/config";
import express from "express";
import * as portfinder from "portfinder";
import { registerRoutes } from "./routes";
import { log, serveStatic, setupVite } from "./vite";
var originalRoute = express.Router.route;
express.Router.route = function(path) {
  console.log("Registering route:", path);
  try {
    return originalRoute.call(this, path);
  } catch (error) {
    console.error(`Error registering route ${path}:`, error);
    throw error;
  }
};
var app = express();
app.disable("x-powered-by");
var DEFAULT_PORT = 7777;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
var resolvePort = async () => {
  const basePort = parseInt(process.env.PORT || DEFAULT_PORT.toString(), 10);
  try {
    portfinder.setBasePort(basePort);
    const port = await portfinder.getPortPromise();
    if (port !== basePort) {
      log(`\u26A0\uFE0F Port ${basePort} in use, using ${port} instead`);
    }
    return port;
  } catch (err) {
    log(`\u26A0\uFE0F Port resolution failed (${err instanceof Error ? err.message : String(err)}), using ${DEFAULT_PORT}`);
    return DEFAULT_PORT;
  }
};
var errorHandler = (err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error(`[Error] ${status}: ${message}`);
  if (err.stack) console.error(err.stack);
  res.status(status).json({ message });
};
var initializeApp = async () => {
  try {
    const server = await registerRoutes(app);
    app.use(errorHandler);
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
    const port = await resolvePort();
    server.listen(port, () => {
      console.log(`
\u{1F680} Server started successfully
\u{1F4E1} Mode: ${app.get("env")}
\u{1F310} URL: http://localhost:${port}
      `);
    });
    const shutdown = () => {
      console.log("\n\u{1F44B} Shutting down gracefully...");
      server.close(() => {
        console.log("\u2705 Server closed successfully");
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
var index_default = app;
export {
  index_default as default
};
