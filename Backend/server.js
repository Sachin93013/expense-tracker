import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);


// Test Route
app.get("/", (req, res) => {
  res.json({
    message: "Expense Tracker API is running"
  });
});

const PORT = process.env.PORT || 5000;


const startServer = async () => {
    try {
        await connectDB();
    
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log("Server failed:", error.message);
    }
};

  startServer();