import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  subscribeToUser,
  unsubscribeFromUser,
  likeVideo,
  unlikeVideo,
  likeComment,
  unlikeComment,
} from "../controllers/user.js";
import { verifyUser } from "../middleware/verifyJWT.js";

const router = express.Router();

router.get("/find/:id", getUser);
router.put("/:id", verifyUser, updateUser);
router.delete("/:id", verifyUser, deleteUser);
router.put("/:id/subscribe/:target", verifyUser, subscribeToUser);
router.put("/:id/unsubscribe/:target", verifyUser, unsubscribeFromUser);
router.put("/:id/video/like/:videoId", verifyUser, likeVideo);
router.put("/:id/video/unlike/:videoId", verifyUser, unlikeVideo);
router.put("/:id/comment/like/:commentId", verifyUser, likeComment);
router.put("/:id/comment/unlike/:commentId", verifyUser, unlikeComment);

export default router;
