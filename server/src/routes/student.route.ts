import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  addStudent,
  deleteStudent,
  getStudents,
  searchStudents,
  updateStudent,
} from "../controller/student.controller";
import upload from "../config/multer";

const router = express.Router();

router.get("/", authMiddleware, getStudents);
router.get("/search", authMiddleware, searchStudents);
router.post("/", authMiddleware, upload.single("photo"), addStudent);
router.patch("/", authMiddleware, updateStudent);
router.delete("/:id", authMiddleware, deleteStudent);

export default router;
