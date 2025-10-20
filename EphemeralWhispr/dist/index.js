// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  messages;
  constructor() {
    this.messages = /* @__PURE__ */ new Map();
  }
  async createMessage(insertMessage) {
    const id = randomUUID();
    const message = { ...insertMessage, id };
    this.messages.set(id, message);
    return message;
  }
  async getMessage(id) {
    return this.messages.get(id);
  }
  async deleteMessage(id) {
    return this.messages.delete(id);
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { z } from "zod";
var messageSchema = z.object({
  id: z.string(),
  content: z.string()
});
var insertMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(5e3, "Message is too long (max 5000 characters)")
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/messages", async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData);
      res.json(message);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to create message" });
      }
    }
  });
  app2.get("/msg/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const message = await storage.getMessage(id);
      if (!message) {
        return res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Message Expired - Whispr</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: hsl(217, 33%, 7%);
      color: hsl(210, 40%, 98%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .container {
      max-width: 42rem;
      width: 100%;
      text-align: center;
      animation: fadeIn 0.3s ease-in;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .emoji { font-size: 4rem; margin-bottom: 1.5rem; }
    h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    p {
      color: hsl(217, 19%, 60%);
      font-size: 1rem;
      margin-bottom: 2rem;
    }
    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: hsl(217, 91%, 60%);
      color: white;
      text-decoration: none;
      border-radius: 0.5rem;
      font-weight: 600;
      transition: all 0.2s;
    }
    .btn:hover {
      background: hsl(217, 91%, 65%);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="emoji">\u{1F4A8}</div>
    <h1>Message Expired</h1>
    <p>This secret message has already been read and has self-destructed.</p>
    <a href="/" class="btn">Create Your Own</a>
  </div>
</body>
</html>
        `);
      }
      await storage.deleteMessage(id);
      res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Secret Message - Whispr</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: hsl(217, 33%, 7%);
      color: hsl(210, 40%, 98%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .container {
      max-width: 42rem;
      width: 100%;
      animation: fadeIn 0.3s ease-in;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    .message-box {
      background: hsl(217, 33%, 10%);
      border: 1px solid hsl(217, 33%, 15%);
      border-radius: 0.75rem;
      padding: 2rem;
      margin-bottom: 1rem;
      white-space: pre-wrap;
      word-break: break-word;
      line-height: 1.6;
    }
    .notice {
      text-align: center;
      color: hsl(217, 19%, 60%);
      font-size: 0.875rem;
    }
    .btn {
      display: block;
      margin-top: 2rem;
      padding: 0.75rem 1.5rem;
      background: hsl(217, 33%, 13%);
      color: hsl(210, 40%, 98%);
      text-decoration: none;
      border-radius: 0.5rem;
      font-weight: 600;
      text-align: center;
      border: 1px solid hsl(217, 33%, 18%);
      transition: all 0.2s;
    }
    .btn:hover {
      background: hsl(217, 33%, 16%);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Secret Message \u{1F512}</h1>
    <div class="message-box">${message.content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
    <p class="notice">This message is now deleted \u{1F4A8}</p>
    <a href="/" class="btn">Create Your Own Secret Message</a>
  </div>
</body>
</html>
      `);
    } catch (error) {
      res.status(500).send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error - Whispr</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: hsl(217, 33%, 7%);
      color: hsl(210, 40%, 98%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      text-align: center;
    }
    h1 { font-size: 2rem; margin-bottom: 1rem; }
    p { color: hsl(217, 19%, 60%); }
  </style>
</head>
<body>
  <div>
    <h1>Error</h1>
    <p>Failed to retrieve message. Please try again.</p>
  </div>
</body>
</html>
      `);
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
