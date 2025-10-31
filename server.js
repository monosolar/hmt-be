import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import prisma from "./prisma/client.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// GET /hello?name=testName
app.get("/hello", (req, res) => {
  const name = req.query.name || "World";
  res.json({
    message: `Hello, ${name}`,
  });
});

// Health check endpoint
app.get("/health", async (req, res) => {
  console.log("DATABASE_URL", process?.env?.DATABASE_URL);
  console.log("process", process?.env);
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "connected",
      databaseUrl: process.env.DATABASE_URL,
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      databaseUrl: process.env.DATABASE_URL,
      error: error.message,
    });
  }
});

// User endpoints
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        meetings: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { email, name } = req.body;
    const user = await prisma.user.create({
      data: { email, name },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        meetings: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Meeting endpoints
app.get("/meetings", async (req, res) => {
  try {
    const meetings = await prisma.meeting.findMany({
      include: {
        user: true,
      },
    });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/meetings", async (req, res) => {
  try {
    const { title, description, startTime, endTime, location, userId } =
      req.body;
    const meeting = await prisma.meeting.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location,
        userId,
      },
      include: {
        user: true,
      },
    });
    res.status(201).json(meeting);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/meetings/:id", async (req, res) => {
  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id: req.params.id },
      include: {
        user: true,
      },
    });
    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 Try: http://localhost:${PORT}/hello?name=testName`);
  console.log(`🗃️  Database: PostgreSQL with Prisma ORM`);
});
