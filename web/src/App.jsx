import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import InsertExam from "./pages/InsertExam";
import ViewExams from "./pages/ViewExams";
import Averages from "./pages/Averages";

const tabs = [
  { to: "/", label: "Inserisci esame" },
  { to: "/esami", label: "Visualizza esami" },
  { to: "/medie", label: "Medie pesate" }
];

const navLinkClass = ({ isActive }) =>
  `px-4 py-2 rounded-lg text-sm font-medium transition ${
    isActive ? "bg-blue-600 text-white" : "text-blue-700 hover:bg-blue-50"
  }`;

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6">
          <div>
            <h1 className="text-2xl font-semibold">Gestione Esami Università</h1>
            <p className="text-sm text-slate-500">
              Inserisci e consulta gli esami, con media pesata per studente.
            </p>
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-2 px-4 pb-4">
          {tabs.map((tab) => (
            <NavLink key={tab.to} to={tab.to} end className={navLinkClass}>
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Routes>
          <Route path="/" element={<InsertExam />} />
          <Route path="/esami" element={<ViewExams />} />
          <Route path="/medie" element={<Averages />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
