import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT IdDocente, Nome, Cognome FROM Docente ORDER BY Cognome, Nome"
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

export default router;
