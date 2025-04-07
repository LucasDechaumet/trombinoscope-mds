import express from "express";
import { check, login, logout } from "../controller/auth.controller";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/check", check);

export default router;
