import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import prisma from "./db.js";
import routes from "./routes/index.js";
const app = express();
dotenv.config();

const PORT = process.env.PORT || 8080;

// Allow multiple origins via env CORS_ORIGINS (comma-separated). If not set, reflect the request origin.
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // non-browser or same-origin
      if (allowedOrigins.length === 0) return callback(null, true); // reflect any origin
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use("/", routes);

(async () => {
  try {
    await prisma.$connect();
    console.log("Connected to database via Prisma");
  } catch (err) {
    console.error("Prisma connection error:", err);
  }
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT || 3001}`);
  });
})();
