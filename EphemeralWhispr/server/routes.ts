import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new message
  app.post("/api/messages", async (req, res) => {
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

  // View and delete a message (one-time view)
  app.get("/msg/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const message = await storage.getMessage(id);
      
      if (!message) {
        // Message expired - show expired state
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
    <div class="emoji">💨</div>
    <h1>Message Expired</h1>
    <p>This secret message has already been read and has self-destructed.</p>
    <a href="/" class="btn">Create Your Own</a>
  </div>
</body>
</html>
        `);
      }

      // Delete the message immediately after retrieving it
      await storage.deleteMessage(id);
      
      // Show the message with beautiful HTML
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
    <h1>Secret Message 🔒</h1>
    <div class="message-box">${message.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
    <p class="notice">This message is now deleted 💨</p>
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

  const httpServer = createServer(app);

  return httpServer;
}
