# Campus IoT Bin Dashboard

A real-time dashboard for monitoring campus trash bin fill levels and battery statuses using a simulated IoT hardware pipeline, Supabase, and a FastAPI backend service.

## Overview \& Architecture

This system processes time-series telemetry data via a two-table database architecture and a Python middleware backend API.

* **Frontend**: React, Vite, React-Leaflet
* **Backend API**: Python, FastAPI, Uvicorn
* **IoT Hardware Simulator**: Python (`simulator.py`)
* **Database**: Supabase (PostgreSQL + Realtime WebSockets)

## Database Schema

The database relies on two tables and an automated trigger to process incoming telemetry pings.

|Table|Purpose|Key Columns|
|-|-|-|
|`bins`|Current state for the React map|`id`, `lat`, `long`, `fill\_level`, `battery\_level`, `time`|
|`telemetry\_logs`|Time-series historical data|`id`, `bin\_id`, `fill\_level`, `battery\_level`, `time`|

> \*\*Automation Note:\*\* An `AFTER INSERT` trigger on `telemetry\_logs` automatically updates `fill\_level`, `battery\_level`, and `time` on the corresponding record in `bins`.

## Prerequisites

* **Node.js** (v18+ recommended)
* **Python** (v3.10+ recommended)

## Environment Setup

Create two `.env` files locally before running the services (these are ignored by Git for security):

**1. Frontend (`frontend/.env`)**:

```text
VITE\_SUPABASE\_URL=your\_supabase\_project\_url
VITE\_SUPABASE\_ANON\_KEY=your\_supabase\_anon\_key
```

**2. Backend (`backend/.env`)**:

```text
SUPABASE\_URL=your\_supabase\_project\_url
SUPABASE\_KEY=your\_supabase\_service\_role\_key
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

* **macOS / Linux**:

```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

* **Windows (Command Prompt / PowerShell)**:

```bash
  python -m venv venv
  .\\venv\\Scripts\\activate
  ```

> \*\*Note:\*\* Ensure `(venv)` appears at the start of your terminal prompt before installing packages.

#### Step B: Install Python Dependencies

Install all required libraries directly in your active virtual environment:

```bash
pip install fastapi "uvicorn\[standard]" supabase python-dotenv
```

#### Step C: Run the API Server

Start the FastAPI backend with hot-reloading enabled:

```bash
uvicorn main:app --reload
```

The API server will run at `http://127.0.0.1:8000`.

#### Step D: Run the Hardware Simulator

In a separate terminal (with the virtual environment activated), start the telemetry simulator:

```bash
python simulator.py
```

