# Campus IoT Bin Dashboard Test

A real-time dashboard for monitoring campus trash bin fill levels and battery statuses using a simulated IoT hardware pipeline, Supabase, and a FastAPI backend service.

## Overview \& Architecture

This system processes time-series telemetry data via a two-table database architecture and a Python middleware backend API.

- **Frontend**: React, Vite, React-Leaflet
- **Backend API**: Python, FastAPI, Uvicorn
- **IoT Hardware Simulator**: Python (`simulator.py`)
- **Database**: Supabase (PostgreSQL + Realtime WebSockets)

## Database Schema

The database relies on two tables and an automated trigger to process incoming telemetry pings.

| Table            | Purpose                         | Key Columns                                                |
| ---------------- | ------------------------------- | ---------------------------------------------------------- |
| `bins`           | Current state for the React map | `id`, `lat`, `long`, `fill_level`, `battery_level`, `time`,`location`, `compost`, `recycle`, `landfil` |
| `telemetry_logs` | Time-series historical data     | `id`, `bin_id`, `fill_level`, `battery_level`, `time`, `compost`, `recycle`, `landfil` |

> \*\*Automation Note:\*\* An `AFTER INSERT` trigger on `telemetry_logs` automatically updates `fill_level`, `battery_level`,  `compost`, `recycle`, `landfil` and `time` on the corresponding record in `bins`.

## Prerequisites

- **Node.js** (v18+ recommended)
- **Python** (v3.10+ recommended)

## Environment Setup

Create two `.env` files locally before running the services (these are ignored by Git for security):

**1. Frontend (`frontend/.env`)**:

```text
VITE_SUPABASE_CLIENT=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**2. Backend (`backend/.env`)**:

```text
SUPABASE_CLIENT=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key
```

\---

## Setup \& Running the Project

### 1\. Frontend Setup

Navigate to the `frontend` directory, install Node packages, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

### 2\. Backend Setup

Navigate to your `backend` directory:

```bash
cd backend
```

#### Step A: Create and Activate Virtual Environment

- **macOS / Linux**:

```bash
  python3 -m venv venv
  source venv/bin/activate
```

- **Windows (Command Prompt / PowerShell)**:

```bash
  python -m venv venv
  .\venv\Scripts\activate
```

> \*\*Note:\*\* Ensure `(venv)` appears at the start of your terminal prompt before installing packages.

#### Step B: Install Python Dependencies

Install all required libraries directly in your active virtual environment:

```bash
pip install fastapi uvicorn supabase python-dotenv
```

#### Step C: Run the API Server

Start the FastAPI backend with hot-reloading enabled:

```bash
uvicorn main:app --reload
```

The API server will run at `http://127.0.0.1:8000`.

#### Step D: Run the Hardware Simulator

In a separate terminal (with the virtual environment activated), start the telemetry simulator:

> \*\*Note:\*\* Ensure `(venv)` appears at the start of your terminal prompt.

```bash
python simulator.py
```
