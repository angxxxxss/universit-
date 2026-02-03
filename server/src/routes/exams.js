import { Router } from "express";
import pool from "../db.js";

const router = Router();

const isValidDate = (value) => {
  if (!value) {
    return false;
  }
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

const validateScore = (value) => {
  if (value === null || value === undefined) {
    return false;
  }
  const score = Number(value);
  return Number.isFinite(score) && score >= 18 && score <= 30;
};

const fetchExists = async (table, column, value) => {
  const result = await pool.query(`SELECT 1 FROM ${table} WHERE ${column} = $1`, [value]);
  return result.rowCount > 0;
};

router.post("/", async (req, res, next) => {
  try {
    const { Matricola, IdMateria, IdDocente, DataEsame, Voto, Lode } = req.body || {};

    if (!Matricola || !IdMateria || !IdDocente || !DataEsame) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    if (!isValidDate(DataEsame)) {
      return res.status(400).json({ error: "DataEsame must be a valid date (YYYY-MM-DD)." });
    }

    if (!validateScore(Voto)) {
      return res.status(400).json({ error: "Voto must be between 18 and 30." });
    }

    const [studentExists, subjectExists, docentExists] = await Promise.all([
      fetchExists("Studente", "Matricola", Matricola),
      fetchExists("Materia", "IdMateria", IdMateria),
      fetchExists("Docente", "IdDocente", IdDocente)
    ]);

    if (!studentExists) {
      return res.status(400).json({ error: "Matricola non esistente." });
    }

    if (!subjectExists) {
      return res.status(400).json({ error: "Materia non esistente." });
    }

    if (!docentExists) {
      return res.status(400).json({ error: "Docente non esistente." });
    }

    const duplicateCheck = await pool.query(
      "SELECT 1 FROM Esame WHERE Matricola = $1 AND IdMateria = $2 AND DataEsame = $3",
      [Matricola, IdMateria, DataEsame]
    );

    if (duplicateCheck.rowCount > 0) {
      return res.status(409).json({ error: "Esame duplicato per lo stesso studente e data." });
    }

    const insertResult = await pool.query(
      `INSERT INTO Esame (Matricola, IdMateria, IdDocente, DataEsame, Voto, Lode)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING Matricola, IdMateria, IdDocente, DataEsame, Voto, Lode`,
      [Matricola, IdMateria, IdDocente, DataEsame, Number(Voto), Boolean(Lode)]
    );

    res.status(201).json(insertResult.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const { student, docent, subject } = req.query;
    const filters = [];
    const values = [];

    if (student) {
      values.push(student);
      filters.push(`e.Matricola = $${values.length}`);
    }

    if (docent) {
      values.push(docent);
      filters.push(`e.IdDocente = $${values.length}`);
    }

    if (subject) {
      values.push(subject);
      filters.push(`e.IdMateria = $${values.length}`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

    const result = await pool.query(
      `SELECT e.Matricola,
              s.Nome AS StudenteNome,
              s.Cognome AS StudenteCognome,
              e.IdDocente,
              d.Nome AS DocenteNome,
              d.Cognome AS DocenteCognome,
              e.IdMateria,
              m.Nome AS MateriaNome,
              m.CFU,
              e.DataEsame,
              e.Voto,
              e.Lode
       FROM Esame e
       JOIN Studente s ON e.Matricola = s.Matricola
       JOIN Docente d ON e.IdDocente = d.IdDocente
       JOIN Materia m ON e.IdMateria = m.IdMateria
       ${whereClause}
       ORDER BY e.DataEsame DESC`,
      values
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.get("/students/:matricola", async (req, res, next) => {
  try {
    const { matricola } = req.params;
    const result = await pool.query(
      `SELECT e.Matricola,
              s.Nome AS StudenteNome,
              s.Cognome AS StudenteCognome,
              e.IdDocente,
              d.Nome AS DocenteNome,
              d.Cognome AS DocenteCognome,
              e.IdMateria,
              m.Nome AS MateriaNome,
              m.CFU,
              e.DataEsame,
              e.Voto,
              e.Lode
       FROM Esame e
       JOIN Studente s ON e.Matricola = s.Matricola
       JOIN Docente d ON e.IdDocente = d.IdDocente
       JOIN Materia m ON e.IdMateria = m.IdMateria
       WHERE e.Matricola = $1
       ORDER BY e.DataEsame DESC`,
      [matricola]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

export default router;
