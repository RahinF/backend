import express from "express";
import {
  addVideo,
  addViewToVideo,
  deleteVideo,
  getRandomVideo,
  getSubcriptionVideos,
  getTrendingVideo,
  getVideo,
  getVideoBySearch,
  getVideoByTag,
  getVideosByUser,
  updateVideo,
} from "../controllers/video.js";
import { verifyToken } from "../middleware/verifyJWT.js";

const router = express.Router();

router.post("/", verifyToken, addVideo);
router.put("/:id", verifyToken, updateVideo);
router.delete("/:id", verifyToken, deleteVideo);
router.get("/subscriptions", verifyToken, getSubcriptionVideos);

router.get("/user/:id", getVideosByUser);
router.get("/find/:id", getVideo);
router.put("/view/:id", addViewToVideo);
router.get("/random", getRandomVideo);
router.get("/trending", getTrendingVideo);
router.get("/tags", getVideoByTag);
router.get("/search", getVideoBySearch);

export default router;
