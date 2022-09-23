import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    videoId: { type: String, required: true },
    description: { type: String, required: true },
    likes: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
