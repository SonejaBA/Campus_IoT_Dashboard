from fastapi import FastAPI, HTTPException, Query
from collections import defaultdict
from overserviced import find_clearings
from pydantic import BaseModel
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
    "http://localhost:5174",
    "http://10.0.0.73:5173"
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

class BinCreate(BaseModel):
    id: int
    lat: float
    long: float
    location: str
    zone: str | None = None

class BinUpdate(BaseModel):
    lat: float
    long: float
    location: str
    zone: str | None = None

@app.post("/api/bins")
def create_bin(bin_data: BinCreate):
    try:
        response = (
            supabase
            .table("bins")
            .insert({
                "id": bin_data.id,
                "lat": bin_data.lat,
                "long": bin_data.long,
                "location": bin_data.location,
                "zone": bin_data.zone,
                "fill_level": 0,
                "battery_level": 100,
                "compost": 0,
                "recycle": 0,
                "landfill": 0,
            })
            .execute()
        )
        return response.data[0]

    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )
@app.patch("/api/bins/{bin_id}")
def update_bin(bin_id: int, bin_data: BinUpdate):
    try:
        response = (
            supabase
            .table("bins")
            .update({
                "lat": bin_data.lat,
                "long": bin_data.long,
                "location": bin_data.location,
                "zone": bin_data.zone,
            })
            .eq("id", bin_id)
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="Bin not found.",
            )

        return response.data[0]

    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

@app.delete("/api/bins/{bin_id}")
def delete_bin(bin_id: int):
    try:
        response = (
            supabase
            .table("bins")
            .delete()
            .eq("id", bin_id)
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="Bin not found.",
            )

        return {
            "message": "Bin deleted successfully.",
            "id": bin_id,
        }

    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )




@app.get("/api/bins")
def get_bins():
    # Go to the 'bins' table, select all columns (*), and execute the query
    response = supabase.table("bins").select("*").order("id").execute()
    
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
    
# ticket 44 Reset Endpoint
@app.post("/api/bins/{bin_id}/reset")
async def reset_bin_status(bin_id: int):
    try:
        last_log = (
            supabase.table("telemetry_logs")
            .select("battery_level")
            .eq("bin_id", bin_id)
            .order("time", desc=True)
            .limit(1)
            .execute()
        )

        previous_battery = 0
        if last_log.data and len(last_log.data) > 0:
            previous_battery = last_log.data[0].get("battery_level", 0)

        log_response = supabase.table("telemetry_logs").insert({
            "bin_id": bin_id,
            "compost": 0,
            "landfill": 0,
            "recycle": 0,
            "fill_level": 0,
            "battery_level": previous_battery,
            "is_manual" : True
        }).execute()

        return {
            "message": f"Bin {bin_id} successfully reset via telemetry log",
            "data": log_response.data
        }
    except Exception as e:
        print(f"Error resetting bin: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/overserviced")
def get_overserviced_bins(
    days: int = Query(7, ge=1, le=30),               # how far back to look
    min_drop: int = Query(20, ge=1, le=100),         # smallest drop that counts as a pickup
    max_fill_before: int = Query(50, ge=1, le=100),  # pickup only counts if the bin was under this
    min_events: int = Query(4, ge=1, le=50),         # 4 = "more than 3 times"
):
    # Only look at readings from the last `days` days
    since = (datetime.now(timezone.utc) - timedelta(days=days)).strftime("%Y-%m-%dT%H:%M:%SZ")

    bins_response = supabase.table("bins").select("id, location").execute()
    locations = {b["id"]: b["location"] for b in bins_response.data}

    rows = []
    page_size = 1000
    start = 0
    while True:
        batch = (
            supabase.table("telemetry_logs")
            .select("id, bin_id, fill_level, time")
            .gte("time", since)
            .order("bin_id")
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

    # Group readings by bin (rows are already in time order within each bin)
    readings_by_bin = defaultdict(list)
    for row in rows:
        readings_by_bin[row["bin_id"]].append(row)

    flagged = []
    for bin_id, readings in readings_by_bin.items():
        events = find_clearings(readings, min_drop, max_fill_before)
        if len(events) >= min_events:
            flagged.append({
                "bin_id": bin_id,
                "location": locations.get(bin_id, ""),
                "event_count": len(events),
                "events": events,
            })

    flagged.sort(key=lambda b: b["event_count"], reverse=True)

    return {
        "params": {
            "days": days,
            "min_drop": min_drop,
            "max_fill_before": max_fill_before,
            "min_events": min_events,
        },
        "bins": flagged,
    }