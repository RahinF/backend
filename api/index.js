import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "../src/routes/user.js";
import authRoutes from "../src/routes/auth.js";
import commentRoutes from "../src/routes/comment.js";
import videoRoutes from "../src/routes/video.js";

const app = express();
dotenv.config();


app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:3000", "https://dreamy-beignet-19a5b0.netlify.app"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/videos", videoRoutes);


//error handler
app.use((error, request, response, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong!";
  return response.status(status).json({
    success: false,
    status,
    message,
  });
});


const connectToDatabase = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((error) => {
      throw error;
    });
};


app.listen(process.env.PORT || 8000, () => {
  connectToDatabase();
  console.log("Connected to Server");
});
