import React, { useEffect, useState } from "react";
import Dropdown from "../components/Dropdown";
import ExamTable from "../components/ExamTable";
import { API_BASE, fetchJson } from "../utils/api";

const ViewExams = () => {
  const [students, setStudents] = useState([]);
  const [docents, setDocents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filters, setFilters] = useState({ student: "", docent: "", subject: "" });
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [studentsData, docentsData, subjectsData] = await Promise.all([
          fetchJson(`${API_BASE}/students`),
          fetchJson(`${API_BASE}/docents`),
          fetchJson(`${API_BASE}/subjects`)
        ]);

        setStudents(
          studentsData.map((student) => ({
            value: student.Matricola,
            label: `${student.Nome} ${student.Cognome}`
          }))
        );
        setDocents(
          docentsData.map((docent) => ({
            value: docent.IdDocente,
            label: `${docent.Nome} ${docent.Cognome}`
          }))
        );
        setSubjects(
          subjectsData.map((subject) => ({
            value: subject.IdMateria,
            label: `${subject.Nome} (${subject.CFU} CFU)`
          }))
        );
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, []);

  useEffect(() => {
    const loadExams = async () => {
      setError("");
      try {
        const params = new URLSearchParams();
        if (filters.student) params.set("student", filters.student);
        if (filters.docent) params.set("docent", filters.docent);
        if (filters.subject) params.set("subject", filters.subject);

        const data = await fetchJson(`${API_BASE}/exams?${params.toString()}`);
        setExams(data);
      } catch (loadError) {
        setError(loadError.message);
      }
    };

    loadExams();
  }, [filters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold">Visualizza esami</h2>
        <p className="text-sm text-slate-500">
          Filtra per studente, docente o materia. I dati sono aggiornati in tempo reale.
        </p>
      </header>

      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-3">
        <Dropdown
          label="Studente"
          name="student"
          value={filters.student}
          onChange={handleFilterChange}
          options={students}
          placeholder={loading ? "Caricamento..." : "Tutti"}
        />
        <Dropdown
          label="Docente"
          name="docent"
          value={filters.docent}
          onChange={handleFilterChange}
          options={docents}
          placeholder={loading ? "Caricamento..." : "Tutti"}
        />
        <Dropdown
          label="Materia"
          name="subject"
          value={filters.subject}
          onChange={handleFilterChange}
          options={subjects}
          placeholder={loading ? "Caricamento..." : "Tutte"}
        />
      </div>

      {error ? (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      ) : null}

      <ExamTable exams={exams} />
    </section>
  );
};

export default ViewExams;
