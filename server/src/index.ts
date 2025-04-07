import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import classeRoutes from "./routes/classe.route";
import studentRoutes from "./routes/student.route";
import path from "path";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: ["http://localhost:4200", "https://client-trombinoscope.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/auth", authRoutes);
app.use("/classes", classeRoutes);
app.use("/students", studentRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
