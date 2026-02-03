import React, { useEffect, useState } from "react";
import { API_BASE, fetchJson } from "../utils/api";

const Averages = () => {
  const [averages, setAverages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAverages = async () => {
      try {
        const data = await fetchJson(`${API_BASE}/averages`);
        setAverages(data);
      } catch (loadError) {
        setError(loadError.message);
      }
    };

    loadAverages();
  }, []);

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold">Medie pesate</h2>
        <p className="text-sm text-slate-500">
          Calcolo della media pesata: SUM(voto * CFU) / SUM(CFU), arrotondata a 2 decimali.
        </p>
      </header>

      {error ? (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Matricola</th>
              <th className="px-4 py-3">Studente</th>
              <th className="px-4 py-3">Media pesata</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {averages.map((row) => (
              <tr key={row.Matricola}>
                <td className="px-4 py-3 font-medium">{row.Matricola}</td>
                <td className="px-4 py-3">
                  {row.Nome} {row.Cognome}
                </td>
                <td className="px-4 py-3">
                  {row.media_pesata === null ? "N/A" : row.media_pesata}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Averages;
