from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
            previous_battery = last_log.data[0].get("battery", 0)

        log_response = supabase.table("telemetry_logs").insert({
            "bin_id": bin_id,
            "fill_level": 0,
            "compost": 0,
            "landfill": 0,
            "recycle": 0,
            "fill_level": 0,
            "battery_level": previous_battery
        }).execute()

        return {
            "message": f"Bin {bin_id} successfully reset via telemetry log",
            "data": log_response.data
        }
    except Exception as e:
        print(f"Error resetting bin: {e}")
        raise HTTPException(status_code=500, detail=str(e))