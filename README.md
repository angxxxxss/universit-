# Università - Gestione Esami (Aiven PostgreSQL)

Progetto full-stack con backend Express + PostgreSQL e frontend React + TailwindCSS.

## Requisiti

- Node.js LTS (>= 18)
- PostgreSQL (Aiven) e variabile `DATABASE_URL`

## Setup database (Aiven)

1. Copia lo script SQL fornito in `db/init.sql` (è già presente il placeholder).
2. Esegui lo script con `psql`:

```bash
psql "$DATABASE_URL" -f ./db/init.sql
```

> **Nota:** se Aiven non permette `CREATE DATABASE`, commenta la riga `CREATE DATABASE` nello script e usa il DB già fornito dall'istanza.

## Variabili d'ambiente

Backend (`server/.env`):

```
DATABASE_URL=postgres://user:pass@host:port/universita
PORT=4000
```

Frontend (`web/.env`):

```
REACT_APP_API_URL=http://localhost:4000/api
```

## Avvio locale

Backend:

```bash
cd server
npm install
npm run dev
```

Frontend:

```bash
cd web
npm install
npm start
```

## API REST

### GET /api/students
Restituisce l'elenco studenti.

### GET /api/docents
Restituisce l'elenco docenti.

### GET /api/subjects
Restituisce l'elenco materie.

### POST /api/exams

Body JSON:

```json
{
  "Matricola": "S001",
  "IdMateria": "M001",
  "IdDocente": "D001",
  "DataEsame": "2024-06-12",
  "Voto": 28,
  "Lode": false
}
```

### GET /api/exams
Query params opzionali:

- `student` (Matricola)
- `docent` (IdDocente)
- `subject` (IdMateria)

### GET /api/averages
Restituisce la media pesata per studente (con `Lode` trattata come 30).

### GET /api/exams/students/:matricola
Comodità per ottenere tutti gli esami di uno studente.

## Esempi curl

```bash
curl http://localhost:4000/api/students
```

```bash
curl "http://localhost:4000/api/exams?student=S001"
```

```bash
curl -X POST http://localhost:4000/api/exams \
  -H "Content-Type: application/json" \
  -d '{"Matricola":"S001","IdMateria":"M001","IdDocente":"D001","DataEsame":"2024-06-12","Voto":28,"Lode":false}'
```

## Codespaces / Dev Container

La configurazione in `.devcontainer/` include Node LTS e `psql` per eseguire lo script SQL.
