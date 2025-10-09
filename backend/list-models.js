require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    console.log(
      "🔑 API Key loaded:",
      process.env.GEMINI_API_KEY ? "YES" : "NO"
    );
    console.log(
      "🔑 Key starts with:",
      process.env.GEMINI_API_KEY?.substring(0, 10)
    );
    console.log("\n🔍 Fetching available models...\n");

    // List all models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log("✅ Available models for your API key:\n");

    if (data.models && data.models.length > 0) {
      data.models.forEach((model, index) => {
        console.log(`${index + 1}. ${model.name}`);
        if (model.supportedGenerationMethods?.includes("generateContent")) {
          console.log(`   ✅ Supports generateContent`);
        }
      });
    } else {
      console.log("❌ No models found");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("\n💡 Possible issues:");
    console.error("1. Invalid API key");
    console.error("2. API key doesn't have access to models");
    console.error("3. Network/firewall blocking request");
  }
}

listModels();
