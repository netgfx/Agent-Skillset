const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies (good practice for future endpoints)
app.use(express.json());

// --- LOGGING MIDDLEWARE ---
// This function will run for every request that comes into the server.
app.use((req, res, next) => {
  // Create a timestamp for the log entry
  const timestamp = new Date().toISOString();

  // Gather all relevant information from the incoming request
  const logDetails = {
    timestamp: timestamp,
    method: req.method,
    url: req.originalUrl,
    // The request body contains the platform parameter from Copilot's codebase analysis
    body: req.body,
    // The 'query' object contains all URL query parameters.
    query: req.query,
    // Headers can contain useful context, like the User-Agent from Copilot
    headers: req.headers,
    // The remote IP address of the client
    remoteAddress: req.ip,
  };

  // Log the details as a structured JSON string for easy parsing and reading.
  console.log("--- INCOMING REQUEST ---");
  console.log(JSON.stringify(logDetails, null, 2)); // The '2' makes the JSON output pretty
  console.log("------------------------");

  // Call next() to pass the request to the next handler in the chain (our API endpoint)
  next();
});
// --- END OF LOGGING MIDDLEWARE ---

// The core API endpoint that serves the agents.md file
app.post("/api/agents", (req, res) => {
  // 1. Try to get platform from direct parameter first (new approach)
  let platform = req.body.platform;

  // 2. If no platform parameter, try to get from context (fallback to old approach)
  if (!platform && req.body.context && req.body.context.repoName) {
    platform = req.body.context.repoName;
    console.log(
      `[INFO] No platform parameter, using context.repoName: "${platform}"`
    );
  }

  // 3. Log what we received
  console.log(`[INFO] Request body:`, JSON.stringify(req.body, null, 2));
  console.log(`[INFO] Final platform value: "${platform}"`);

  // 4. Validate platform and set fallback
  const validPlatforms = ["web", "android", "ios", "default"];
  if (!platform || !validPlatforms.includes(platform)) {
    console.log(
      `[WARN] Invalid or missing platform. Falling back to 'default'. Input: "${platform}"`
    );
    platform = "default";
  }

  // 5. Construct the full path to the requested agents.md file.
  const filePath = path.join(__dirname, "platforms", platform, "agents.md");
  console.log(`[INFO] Attempting to serve file from path: ${filePath}`);

  // 6. File serving logic remains the same.
  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type", "text/markdown; charset=UTF-8");
    res.status(200).sendFile(filePath);
  } else {
    console.log(
      `[WARN] Platform file not found for "${platform}". Attempting to serve default.`
    );
    const defaultPath = path.join(
      __dirname,
      "platforms",
      "default",
      "agents.md"
    );
    if (fs.existsSync(defaultPath)) {
      res.setHeader("Content-Type", "text/markdown; charset=UTF-8");
      res.status(200).sendFile(defaultPath);
    } else {
      console.error("[ERROR] Default agents.md not found. Sending 404.");
      res.status(404).send("Agent configuration not found.");
    }
  }
});

app.listen(PORT, () => {
  console.log(`Copilot skillset service running on http://localhost:${PORT}`);
});
