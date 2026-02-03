import React from "react";

const ExamTable = ({ exams }) => {
  if (!exams.length) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
        Nessun esame trovato con i filtri selezionati.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Studente</th>
            <th className="px-4 py-3">Materia</th>
            <th className="px-4 py-3">Docente</th>
            <th className="px-4 py-3">Data</th>
            <th className="px-4 py-3">Voto</th>
            <th className="px-4 py-3">Lode</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {exams.map((exam) => (
            <tr key={`${exam.Matricola}-${exam.IdMateria}-${exam.DataEsame}`}>
              <td className="px-4 py-3">
                {exam.StudenteNome} {exam.StudenteCognome}
              </td>
              <td className="px-4 py-3">{exam.MateriaNome}</td>
              <td className="px-4 py-3">
                {exam.DocenteNome} {exam.DocenteCognome}
              </td>
              <td className="px-4 py-3">{exam.DataEsame}</td>
              <td className="px-4 py-3 font-semibold text-slate-800">
                {exam.Voto}
                <span className="ml-1 text-xs text-slate-500">/30</span>
              </td>
              <td className="px-4 py-3">{exam.Lode ? "Sì" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExamTable;
