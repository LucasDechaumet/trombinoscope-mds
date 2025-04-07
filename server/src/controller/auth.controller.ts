import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../config/db";
import { User } from "../interfaces/user";
import { generateToken, verifyToken } from "../utils/token";

export const check = async (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "Non authentifié" });
    return;
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    res.status(401).json({ message: "Token invalide" });
    return;
  }

  res.status(200).json();
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const [rows] = await db.query<User[]>("SELECT * FROM user WHERE email = ?", [email]);

  if (!rows.length) {
    res.status(401).json({ message: "Aucun utilisateur n'a été trouvé." });
    return;
  }

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    res.status(401).json({ message: "Mot de passe incorrect." });
    return;
  }

  const token = generateToken({ username: user.email });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Connexion réussie",
  });
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" });
  res.status(200).json({ message: "Déconnexion réussie" });
};
