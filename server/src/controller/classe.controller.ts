import { Request, Response } from "express";
import { db } from "../config/db";
import { Classe } from "../interfaces/classe";
import { Branch } from "../interfaces/branch";

export const getBranches = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<Branch[]>("SELECT DISTINCT branch, icon FROM classe");

    const formatted = rows.map((row: any) => ({
      name: row.branch.charAt(0).toUpperCase() + row.branch.slice(1),
      icon: row.icon,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des filières.",
      error,
    });
  }
};

export const getClasses = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<Classe[]>("SELECT * FROM classe");
    res.status(200).json(rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des classes.", error: error });
  }
};

export const addClasse = async (req: Request, res: Response) => {
  const { name, branch } = req.body;
  try {
    await db.query("INSERT INTO classe (name, branch, icon) VALUES (?, ?, ?)", [
      name.toUpperCase(),
      branch.name.toLowerCase(),
      branch.icon,
    ]);
    res.status(201).json({ message: "Classe ajoutée avec succès." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout de la classe.", error: error });
  }
};
