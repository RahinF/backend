import express from "express";
import { login, logout, refreshToken, register } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/refresh", refreshToken);
router.post("/logout", logout);

export default router;
