import express from "express";
import cors from "cors";
import apiRoutes from "./routes/v1_routes/index.js";

const app = express();


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));


// cors configurations
// app.use() -> middlewares 
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

// API routes 
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Backend World!!!"
    })
});


app.use("/api",apiRoutes);

export default app;