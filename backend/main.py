from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
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

#time range definitions for analytics page
TIME_RANGES = {
    "24h": timedelta(hours=24),
    "7d": timedelta(days=7),
    "30d": timedelta(days=30),
}


@app.get("/api/analytics/{bin_id}")
def get_bin_logs(bin_id: int, time_range: str = "7d"):

    timeDelta = TIME_RANGES.get(time_range) #this variable is used to translate the time the client requests
    
    if timeDelta is None: raise HTTPException(
        status_code=400,
        detail = f"Time range is invalid. Please use {', '.join(TIME_RANGES)}"
    )
    start_time = (datetime.now(timezone.utc) - timeDelta).isoformat()
    
    # Get this bin's latest readings since start_time (this is paged; Supabase caps responses at 1000 rows)

    rows = []
    page_size = 1000
    start = 0

    while True:
        batch = (
            supabase
            .table("telemetry_logs")
            .select("*")
            .eq("bin_id", bin_id)
            .gte("time", start_time)
            .order("time")
            .order("id")
            .range(start, start + page_size - 1)
            .execute()
            .data
        )
        rows.extend(batch)

        if len(batch) < page_size:
            break
        start += page_size

    return rows

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

    
