require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const server = http.createServer(app);

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configure CORS to handle Vercel preview deployments
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
  /^https:\/\/expense-tracker-.*\.vercel\.app$/, // Matches all Vercel deployments
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some((allowedOrigin) => {
      if (typeof allowedOrigin === "string") {
        return allowedOrigin === origin;
      }
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

connectDB();

//api routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Server uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Configure Socket.IO with same CORS
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.some((allowedOrigin) => {
        if (typeof allowedOrigin === "string") {
          return allowedOrigin === origin;
        }
        if (allowedOrigin instanceof RegExp) {
          return allowedOrigin.test(origin);
        }
        return false;
      });
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"), false);
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Socket.IO for AI Chat
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("user-message", async (data) => {
    const { message, userContext } = data;

    console.log("📩 Received message:", message);

    try {
      // Get Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // Create context-aware prompt
      const prompt = `
You are a helpful AI financial assistant for an expense tracking application.

User's Financial Summary:
- Total Balance: $${userContext?.totalBalance || 0}
- Total Income: $${userContext?.totalIncome || 0}
- Total Expenses: $${userContext?.totalExpenses || 0}
- Recent Expenses: ${JSON.stringify(userContext?.recentExpenses || [])}

User Question: ${message}

Instructions:
- Provide helpful, concise responses (2-3 sentences max)
- If asked about their finances, use the data provided above
- Be friendly, professional, and encouraging
- Give actionable financial advice when appropriate
- If the question is general, answer helpfully but relate to finance when possible

Response:`;

      console.log("🤖 Calling Gemini AI...");

      // Get AI response
      const result = await model.generateContent(prompt);
      const response = result.response;
      const aiMessage = response.text();

      console.log("✅ Got response:", aiMessage.substring(0, 50) + "...");

      // Send AI response back
      socket.emit("ai-response", {
        message: aiMessage,
        timestamp: new Date().toISOString(),
      });

      console.log("✅ AI Response sent");
    } catch (error) {
      console.error("❌ AI Error:", error);
      socket.emit("ai-response", {
        message:
          "Sorry, I'm having trouble processing your request right now. Please try again!",
        timestamp: new Date().toISOString(),
        error: true,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

// ✅ Change app.listen to server.listen
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = { app, server, io };
