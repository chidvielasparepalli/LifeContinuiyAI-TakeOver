import { Composio } from "@composio/core";
import dotenv from "dotenv";
dotenv.config();

const client = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });

// Get the Gmail toolkit info to find available versions
try {
  const info = await client.toolkits.get("gmail");
  console.log("TOOLKIT INFO:", JSON.stringify(info, null, 2));
} catch (e) {
  console.error("toolkits.get failed:", e.message);
}

// Try listing toolkits
try {
  const list = await client.toolkits.list({ toolkitSlug: "gmail" });
  console.log("TOOLKIT LIST:", JSON.stringify(list, null, 2));
} catch (e) {
  console.error("toolkits.list failed:", e.message);
}

// Check execute signature from source
import { readFileSync } from "fs";
const src = readFileSync("./node_modules/@composio/core/dist/index.mjs", "utf8");
// Find the execute method definition
const execIdx = src.indexOf("async execute(toolSlug");
if (execIdx > -1) {
  console.log("\nexecute() signature:", src.slice(execIdx, execIdx + 600));
}

// Also search for ToolVersionRequired to see what check happens
const versionIdx = src.indexOf("TOOL_VERSION_REQUIRED");
if (versionIdx > -1) {
  console.log("\nVersion check code:", src.slice(Math.max(0, versionIdx - 200), versionIdx + 400));
}
