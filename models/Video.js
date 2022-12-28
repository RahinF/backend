import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    duration: {type: Number },
    imageUrl: { type: String },
    videoUrl: { type: String, required: true },
    views: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    likes: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
