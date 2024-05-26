import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import coinRoutes from "./routes/coinRoutes.js";
import imageRoutes from "./routes/imageRoutes.js"; // Import the image routes
import dotenv from "dotenv";

import { authenticate } from "./middlewares/auth.js";

const app = express();

// app.use(cors());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(bodyParser.json());
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/coins", coinRoutes);
app.use("/api/images", imageRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Route is !Not Working!!",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
