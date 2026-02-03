import express from "express";
import cors from "cors";
import studentsRouter from "./routes/students.js";
import docentsRouter from "./routes/docents.js";
import subjectsRouter from "./routes/subjects.js";
import examsRouter from "./routes/exams.js";
import averagesRouter from "./routes/averages.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/students", studentsRouter);
app.use("/api/docents", docentsRouter);
app.use("/api/subjects", subjectsRouter);
app.use("/api/exams", examsRouter);
app.use("/api/averages", averagesRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
