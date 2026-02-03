import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT IdMateria, Nome, CFU FROM Materia ORDER BY Nome"
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

export default router;
