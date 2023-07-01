import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
const app = express();
dotenv.config();

const PORT = process.env.PORT || 8080;
const corsOption = { origin: process.env.URL || "*" };

app.use(cors(corsOption));
app.use(express.json());
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT || 3001}`);
});
