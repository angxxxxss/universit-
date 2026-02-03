import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT s.Matricola,
              s.Nome,
              s.Cognome,
              ROUND(
                SUM(CASE WHEN e.Lode THEN 30 ELSE e.Voto END * m.CFU)::numeric
                / NULLIF(SUM(m.CFU), 0),
                2
              ) AS media_pesata
       FROM Studente s
       LEFT JOIN Esame e ON s.Matricola = e.Matricola
       LEFT JOIN Materia m ON e.IdMateria = m.IdMateria
       GROUP BY s.Matricola, s.Nome, s.Cognome
       ORDER BY s.Cognome, s.Nome`
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

export default router;
