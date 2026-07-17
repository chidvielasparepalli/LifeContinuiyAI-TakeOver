/**
 * setup_composio_gmail.js
 * Run once to create a Gmail Auth Config using Composio managed OAuth.
 * Correct API: composio.authConfigs.create(toolkitSlug, options)
 */
import { Composio } from "@composio/core";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.COMPOSIO_API_KEY;
if (!apiKey) {
  console.error("❌ COMPOSIO_API_KEY is not set in .env");
  process.exit(1);
}

console.log("✅ Using API Key:", apiKey.slice(0, 10) + "...");
const client = new Composio({ apiKey });

async function run() {
  // 1. List existing Gmail auth configs first
  try {
    console.log("\n🔍 Checking for existing Gmail auth configs...");
    const existing = await client.authConfigs.list({ toolkitSlug: "gmail" });
    const items = Array.isArray(existing) ? existing : (existing?.items || []);
    if (items.length > 0) {
      console.log("✅ Found existing Gmail auth config(s):");
      for (const ac of items) {
        console.log(`   id=${ac.id}  name=${ac.name}  status=${ac.status}`);
      }
      console.log("\n👉 Add this to your .env:");
      console.log(`COMPOSIO_GMAIL_AUTH_CONFIG_ID="${items[0].id}"`);
      return;
    }
    console.log("  None found. Creating new one...");
  } catch (e) {
    console.warn("⚠️  Could not list auth configs:", e.message);
  }

  // 2. Create using the CORRECT two-argument API
  //    composio.authConfigs.create(toolkitSlug, options)
  const attempts = [
    // Docs say: authConfigs.create('gmail', { type: 'use_composio_managed_auth', name: '...' })
    () => client.authConfigs.create("gmail", {
      type: "use_composio_managed_auth",
      name: "Gmail (Managed)",
    }),
    // Fallback: maybe just the slug + empty options
    () => client.authConfigs.create("gmail", {}),
    // Fallback: object with toolkit as string field
    () => client.authConfigs.create({ toolkitSlug: "gmail", type: "use_composio_managed_auth" }),
  ];

  for (const [i, attempt] of attempts.entries()) {
    try {
      console.log(`\n🚀 Attempt ${i + 1}...`);
      const authConfig = await attempt();
      console.log("\n✅ Gmail Auth Config created successfully!");
      console.log("   ID:    ", authConfig.id);
      console.log("   Name:  ", authConfig.name || "(unnamed)");
      console.log("   Status:", authConfig.status || "(unknown)");
      console.log("\n👉 Add this to your .env file:");
      console.log(`COMPOSIO_GMAIL_AUTH_CONFIG_ID="${authConfig.id}"`);
      return;
    } catch (err) {
      const msg = err?.cause?.error?.error?.message || err?.message || String(err);
      const errors = err?.error?.error?.errors || err?.cause?.error?.error?.errors;
      console.error(`   ❌ Attempt ${i + 1} failed: ${msg}`);
      if (errors) console.error("   Errors:", JSON.stringify(errors));
    }
  }

  console.error("\n❌ All attempts failed. Printing full client.authConfigs methods:");
  console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(client.authConfigs)));
}

run().catch(console.error);
