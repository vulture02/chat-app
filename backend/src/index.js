import express from "express";
import authRoutes from "./routes/auth.route.js"; 
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import path from "path";
import { app,server } from "./lib/socket.js";


dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// ✅ CORS Middleware - Ensure it's before all routes
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// ✅ Increase Request Size Limit (Fix for 413 Error)
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Cookie Parser
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
    // Serve static files from the React frontend app
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    // Handle React routing, return all requests to React app
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}


server.listen(PORT, () => {
    console.log("Server is running on port:", PORT);
    connectDB();
});
