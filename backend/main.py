from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()

SUPABASE_CLIENT = os.getenv("SUPABASE_CLIENT")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


supabase: Client = create_client(SUPABASE_CLIENT, SUPABASE_KEY)

app = FastAPI()

origins = [
    "http://localhost:5173",    # Standard Vite React port
    "http://127.0.0.1:5500",    # VS Code Live Server
    "http://127.0.0.1:5173",
    "http://localhost:5174"
]

#allows frontend to connect to server
app.add_middleware(
    CORSMiddleware,
    #limit frontend to testcases for now
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def reed_root():
    return {"message" : "FastAPI is running! (json)"}

@app.get("/api/bins")
def get_bins():
    # Go to the 'bins' table, select all columns (*), and execute the query
    response = supabase.table("bins").select("*").execute()
    
    # Return just the data portion of the Supabase response
    return response.data


@app.get("/api/analytics/{bin_id}")
def get_bin_logs(bin_id):
    # Get this bin's latest 100 readings from the telemetry_logs table.
    response = (
        supabase
        .table("telemetry_logs")
        .select("*")
        .eq("bin_id", bin_id)
        .order("time", desc=True)
        .limit(100)
        .execute()
    )
    # Return the readings, or [] if none match; FastAPI sends them as JSON.
    return response.data[::-1]

@app.get("/api/health")
def health_check():
    try:
        supabase.table("bins").select("id").limit(1).execute()
        return {
            "status": "online",
            "database": "connected"
        }
    except Exception:
        raise HTTPException(
            status_code=503,
            detail={
                "status": "offline",
                "database": "disconnected"
            }
        )


# Export telemetry data
@app.get("/api/export/telemetry")
def export_telemetry(bin_id: int | None = None):
    # This function will return the full telemetry history for the CSV report.
    # Giving the function a bin_id will allow us to view history of a specific bin.

    # We have to use bins table instead of the telemetry_logs table to get the location.
    bins_response = supabase.table("bins").select("id, location").execute()
    locations = {b["id"]: b["location"] for b in bins_response.data}

    rows = []
    page_size = 1000 # According to Supabase documention, max number of rows you can return is 1000
    start = 0

    while True:
        query = (
            supabase.table("telemetry_logs")
            .select("*")
            .order("time")
            .order("id")
            .range(start, start + page_size - 1)
        )
        if bin_id is not None:
            query = query.eq("bin_id", bin_id)

        batch = query.execute().data
        rows.extend(batch)

        if len(batch) < page_size:
            break
        start += page_size

    for row in rows:
        row["location"] = locations.get(row["bin_id"], "")

    return rows
    
