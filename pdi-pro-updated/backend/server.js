import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.js";
import inspectionRoutes from "./routes/inspections.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Production-ready CORS: allow your Netlify domain + localhost dev
const allowedOrigins = [
  process.env.FRONTEND_URL,           // e.g. https://your-app.netlify.app
  "http://localhost:5173",            // Vite dev server
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/inspections", inspectionRoutes);

app.get("/api/health", (req, res) => {
  res.json({ message: "PDC Pro API is running", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
