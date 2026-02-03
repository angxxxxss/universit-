import React, { useEffect, useState } from "react";
import Dropdown from "../components/Dropdown";
import { API_BASE, fetchJson } from "../utils/api";

const todayIso = new Date().toISOString().slice(0, 10);

const InsertExam = () => {
  const [students, setStudents] = useState([]);
  const [docents, setDocents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({
    Matricola: "",
    IdDocente: "",
    IdMateria: "",
    DataEsame: todayIso,
    Voto: "",
    Lode: false
  });
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        setStatus({ type: "error", message: error.message });
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });

    if (!form.Matricola || !form.IdDocente || !form.IdMateria || !form.Voto) {
      setStatus({ type: "error", message: "Compila tutti i campi obbligatori." });
      return;
    }

    try {
      const payload = {
        ...form,
        Voto: Number(form.Voto)
      };

      await fetchJson(`${API_BASE}/exams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      setStatus({ type: "success", message: "Esame inserito con successo." });
      setForm((prev) => ({
        ...prev,
        DataEsame: todayIso,
        Voto: "",
        Lode: false
      }));
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold">Inserisci un nuovo esame</h2>
        <p className="text-sm text-slate-500">
          Compila i campi e salva l&apos;esame. Il backend valida voto e chiavi esterne.
        </p>
      </header>

      <form
        className="grid gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Dropdown
            label="Studente"
            name="Matricola"
            value={form.Matricola}
            onChange={handleChange}
            options={students}
            placeholder={loading ? "Caricamento..." : "Seleziona studente"}
            required
          />
          <Dropdown
            label="Docente"
            name="IdDocente"
            value={form.IdDocente}
            onChange={handleChange}
            options={docents}
            placeholder={loading ? "Caricamento..." : "Seleziona docente"}
            required
          />
          <Dropdown
            label="Materia"
            name="IdMateria"
            value={form.IdMateria}
            onChange={handleChange}
            options={subjects}
            placeholder={loading ? "Caricamento..." : "Seleziona materia"}
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Data esame
            <input
              type="date"
              name="DataEsame"
              value={form.DataEsame}
              onChange={handleChange}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Voto
            <input
              type="number"
              name="Voto"
              min="18"
              max="30"
              value={form.Voto}
              onChange={handleChange}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="18-30"
              required
            />
          </label>
          <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              name="Lode"
              checked={form.Lode}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Lode
          </label>
        </div>

        {status.message ? (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${
              status.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {status.message}
          </div>
        ) : null}

        <div>
          <button
            type="submit"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
            disabled={loading}
          >
            Inserisci esame
          </button>
        </div>
      </form>
    </section>
  );
};

export default InsertExam;
