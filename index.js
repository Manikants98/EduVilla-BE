import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import prisma from "./db.js";
import routes from "./routes/index.js";
const app = express();
dotenv.config();

const PORT = process.env.PORT || 8080;
const corsOption = { origin: process.env.URL || "*" };

app.use(cors(corsOption));
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
