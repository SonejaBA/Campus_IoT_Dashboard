# Campus IoT Bin Dashboard Testing

A real-time dashboard for monitoring campus trash bin fill levels and battery statuses using a simulated IoT hardware pipeline. 

## Overview & Architecture
This system handles time-series telemetry data via a two-table database architecture, keeping the frontend map instantly updated via WebSockets without manual polling.
*   **Frontend**: React, Vite, React-Leaflet
*   **Backend**: Python (IoT Hardware Simulator)
*   **Database**: Supabase (PostgreSQL + Realtime WebSockets)

## Database Schema
The Supabase database relies on two tables and an automated trigger to process sensor pings.

| Table | Purpose | Key Columns |
| :--- | :--- | :--- |
| `bins` | Current state for the React map | `id`, `lat`, `long`, `fill_level`, `battery_level` , `time`|
| `telemetry_logs` | Time-series historical data | `id`, `bin_id`, `fill_level`, `battery_level`, `time` |

> **Automation Note:** An `AFTER INSERT` trigger on `telemetry_logs` automatically pushes the latest `fill_level` and `battery_level` to the `bins` table.

## Environment Setup
You will need to create two `.env` files locally. These are ignored by Git for security.

**1. Frontend (`frontend/.env`)**:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

**2. Backend (`backend/.env`)**:
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key

## Running the Project
Open two separate terminal windows to run the frontend and backend simultaneously.

1.  **Start the Frontend**: Navigate to your frontend directory, run `npm install` to grab dependencies, and then `npm run dev` to launch the map.
2.  **Start the Simulator**: Navigate to your backend directory, ensure you have the required packages (`pip install supabase python-dotenv`), and run `python simulator.py` to begin streaming simulated hardware data.