import { Request, Response } from "express";
import { db } from "../config/db";
import { Student } from "../interfaces/student";
import fs from "fs";
import path from "path";

export const getStudents = async (req: Request, res: Response) => {
  const classe_id = req.query.classe_id;
  try {
    const [rows] = await db.query<Student[]>(
      "SELECT * FROM student WHERE classe_id = ?",
      [classe_id]
    );
    res.status(200).json(rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des étudiants.", error: error });
    return;
  }
};

export const searchStudents = async (req: Request, res: Response) => {
  const { keyword, classe_id } = req.query;
  console.log("keyword", keyword);
  console.log("classe_id", classe_id);
  try {
    const [rows] = await db.query<Student[]>(
      `SELECT * FROM student WHERE classe_id = ? AND (firstname LIKE ? OR lastname LIKE ?)`,
      [classe_id, `%${keyword}%`, `%${keyword}%`]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la recherche des étudiants.",
      error: error,
    });
    return;
  }
};

export const addStudent = async (req: Request, res: Response) => {
  let { firstname, lastname, birthdate, phone, address, classe_id } = req.body;

  if (birthdate) {
    birthdate = new Date(birthdate).toISOString().slice(0, 10);
  }

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  if (firstname) firstname = capitalize(firstname);
  if (lastname) lastname = capitalize(lastname);

  const file = req.file;
  if (!file) {
    res.status(400).json({ message: "Image is required" });
    return;
  }

  const filename = file.filename;
  const photo_url = `${req.protocol}://${req.get("host")}/uploads/${filename}`;
  const imagePath = path.join(__dirname, "../../uploads", filename);

  try {
    await db.query(
      `INSERT INTO student (firstname, lastname, birthdate, phone, address, photo_url, classe_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [firstname, lastname, birthdate, phone, address, photo_url, classe_id]
    );

    res.status(201).json({ message: "Student created successfully", photo_url });
    return;
  } catch (error) {
    console.error("Erreur BDD, suppression du fichier :", filename, error);
    fs.unlink(imagePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error("Erreur suppression fichier image :", unlinkErr);
      }
    });
    res.status(500).json({ message: "Server error", error: error });
    return;
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  let { id, firstname, lastname, birthdate, phone, address } = req.body;
  if (birthdate) {
    birthdate = new Date(birthdate).toISOString().slice(0, 10);
  }

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  if (firstname) firstname = capitalize(firstname);
  if (lastname) lastname = capitalize(lastname);

  await db.query(
    `UPDATE student SET firstname = ?, lastname = ?, birthdate = ?, phone = ?, address = ? WHERE id = ?`,
    [firstname, lastname, birthdate, phone, address, id]
  );

  res.status(200).json({ message: "L'étudiant a bien été modifié" });
};

export const deleteStudent = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const [student] = await db.query<Student[]>("SELECT * FROM student WHERE id = ?", [
      id,
    ]);
    if (student.length === 0) {
      res.status(404).json({ message: "Student not found" });
      return;
    }

    const filename = student[0].photo_url.split("/").pop();
    if (!filename) {
      res.status(400).json({ message: "Filename not found" });
      return;
    }
    const imagePath = path.join(__dirname, "../../uploads", filename);

    await db.query("DELETE FROM student WHERE id = ?", [id]);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Erreur lors de la suppression de l'image :", err);
      }
    });

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
  }
};
