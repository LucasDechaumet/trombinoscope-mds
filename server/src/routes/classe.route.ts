import express from "express";
import { addClasse, getBranches, getClasses } from "../controller/classe.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authMiddleware, getClasses);
router.post("/", authMiddleware, addClasse);
router.get("/branches", authMiddleware, getBranches);

export default router;
