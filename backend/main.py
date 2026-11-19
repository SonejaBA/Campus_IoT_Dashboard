from fastapi import FastAPI, HTTPException, Query
from collections import defaultdict
from overserviced import find_clearings
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
import os
import resend
from html import escape
load_dotenv()

SUPABASE_CLIENT = os.getenv("SUPABASE_CLIENT")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
RESEND_FROM_EMAIL = os.getenv(
    "RESEND_FROM_EMAIL",
    "onboarding@resend.dev",
)
RESEND_TEST_TO_EMAIL = os.getenv("RESEND_TEST_TO_EMAIL")

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY


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

class BinUpdate(BaseModel):
    lat: float
    long: float
    location: str
    zone: str | None = None
DAILY_SUMMARY_FILL_THRESHOLD = 80
DAILY_SUMMARY_BATTERY_THRESHOLD = 20


def build_daily_maintenance_summary():
    response = (
        supabase
        .table("bins")
        .select(
            "id,location,zone,fill_level,battery_level,is_deactivated"
        )
        .order("id")
        .execute()
    )

    alerts = []

    for bin in response.data:
        # Deactivated bins should not appear in the daily service email.
        if bin.get("is_deactivated") is True:
            continue

        fill_level = bin.get("fill_level")
        battery_level = bin.get("battery_level")

        reasons = []

        if (
            fill_level is not None
            and fill_level >= DAILY_SUMMARY_FILL_THRESHOLD
        ):
            reasons.append("critical fill level")

        if (
            battery_level is not None
            and battery_level < DAILY_SUMMARY_BATTERY_THRESHOLD
        ):
            reasons.append("low battery")

        if not reasons:
            continue

        alerts.append(
            {
                "bin_id": bin["id"],
                "location": bin.get("location") or "Unknown location",
                "zone": bin.get("zone") or "Unassigned",
                "fill_level": fill_level,
                "battery_level": battery_level,
                "reasons": reasons,
            }
        )

    alerts.sort(
        key=lambda bin: (
            bin["zone"],
            bin["bin_id"],
        )
    )

    by_zone = defaultdict(list)

    for alert in alerts:
        by_zone[alert["zone"]].append(alert)

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_bins_needing_service": len(alerts),
        "thresholds": {
            "fill_critical": DAILY_SUMMARY_FILL_THRESHOLD,
            "battery_warning": DAILY_SUMMARY_BATTERY_THRESHOLD,
        },
        "zones": dict(by_zone),
    }


@app.get("/api/daily-maintenance-summary")
def get_daily_maintenance_summary():
    try:
        return build_daily_maintenance_summary()
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )
def build_daily_maintenance_email_html(summary):
    total = summary["total_bins_needing_service"]
    thresholds = summary["thresholds"]
    zones = summary["zones"]

    if total == 0:
        return """
        <h2>Daily Maintenance Summary</h2>
        <p>No bins currently need servicing.</p>
        """

    zone_sections = []

    for zone, bins in sorted(zones.items()):
        bin_rows = []

        for bin_data in bins:
            bin_id = f'BIN-{int(bin_data["bin_id"]):03d}'
            location = escape(str(bin_data.get("location") or "Unknown location"))
            fill_level = bin_data.get("fill_level", "N/A")
            battery_level = bin_data.get("battery_level", "N/A")

            reasons = ", ".join(
                escape(str(reason))
                for reason in bin_data.get("reasons", [])
            )

            bin_rows.append(
                f"""
                <li>
                    <strong>{bin_id}</strong> — {location}
                    <br>
                    Fill: {fill_level}% |
                    Battery: {battery_level}%
                    <br>
                    Reason: {reasons}
                </li>
                """
            )

        zone_sections.append(
            f"""
            <h3>Zone {escape(str(zone))}</h3>
            <ul>
                {"".join(bin_rows)}
            </ul>
            """
        )

    return f"""
    <html>
      <body>
        <h2>Daily Maintenance Summary</h2>

        <p>
          <strong>{total}</strong> bin(s) currently need servicing.
        </p>

        <p>
          Critical fill threshold: {thresholds["fill_critical"]}%<br>
          Battery warning threshold: {thresholds["battery_warning"]}%
        </p>

        {"".join(zone_sections)}

        <p>
          This summary was generated automatically by the Campus IoT
          Bin Dashboard.
        </p>
      </body>
    </html>
    """


@app.post("/api/daily-maintenance-summary/email-test")
def send_daily_maintenance_summary_email():
    if not RESEND_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="RESEND_API_KEY is not configured.",
        )

    recipients = [
        email.strip()
        for email in RESEND_TEST_TO_EMAIL.split(",")
        if email.strip()
    ]

    if not recipients:
        raise HTTPException(
            status_code=500,
            detail="RESEND_TEST_TO_EMAIL is not configured.",
        )

    try:
        summary = build_daily_maintenance_summary()

        html_body = build_daily_maintenance_email_html(summary)

        resend.Emails.send({
            "from": RESEND_FROM_EMAIL,
            "to": recipients,
            "subject": "Campus IoT Daily Maintenance Summary",
            "html": html_body,
        })

        return {
            "sent": True,
            "recipients": recipients,
            "total_bins_needing_service": summary[
                "total_bins_needing_service"
            ],
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


class BinDeactivationUpdate(BaseModel):
    is_deactivated: bool


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

@app.patch("/api/bins/{bin_id}/deactivation")
def set_bin_deactivation(
    bin_id: int,
    deactivation: BinDeactivationUpdate,
):
    try:
        response = (
            supabase
            .table("bins")
            .update({
                "is_deactivated": deactivation.is_deactivated,
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

SENSOR_FIELDS = ("compost", "recycle", "landfill")


def analyze_sensor_maintenance(bin_id: int):
    response = (
        supabase
        .table("telemetry_logs")
        .select("id,time,compost,recycle,landfill,is_manual")
        .eq("bin_id", bin_id)
        .order("time", desc=True)
        .order("id", desc=True)
        .limit(100)
        .execute()
    )

    # Ignore manual pings when checking whether a sensor is stuck.
    automatic_logs = [
        row for row in response.data
        if row.get("is_manual") is not True
    ]

    sensor_status = {}

    for sensor in SENSOR_FIELDS:
        latest_values = [
            row.get(sensor)
            for row in automatic_logs[:3]
        ]

        sensor_status[sensor] = (
            len(latest_values) == 3
            and all(value is not None for value in latest_values)
            and latest_values[0] == latest_values[1] == latest_values[2]
        )

    return {
        "bin_id": bin_id,
        "needs_maintenance": any(sensor_status.values()),
        "sensors": sensor_status,
        "automatic_readings_checked": min(len(automatic_logs), 3),
    }


@app.get("/api/maintenance/{bin_id}")
def get_maintenance_status(bin_id: int):
    try:
        return analyze_sensor_maintenance(bin_id)
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


def analyze_all_sensor_maintenance(bin_ids):
    results = {
        bin_id: {
            "bin_id": bin_id,
            "needs_maintenance": False,
            "sensors": {sensor: False for sensor in SENSOR_FIELDS},
            "automatic_readings_checked": 0,
        }
        for bin_id in bin_ids
    }

    if not bin_ids:
        return results

    automatic_logs_by_bin = {bin_id: [] for bin_id in bin_ids}
    page_size = 1000
    start = 0

    while True:
        response = (
            supabase
            .table("telemetry_logs")
            .select("id,bin_id,time,compost,recycle,landfill,is_manual")
            .filter(
                "bin_id",
                "in",
                f"({','.join(str(bin_id) for bin_id in bin_ids)})",
            )
            .order("bin_id")
            .order("time", desc=True)
            .order("id", desc=True)
            .range(start, start + page_size - 1)
            .execute()
        )

        batch = response.data

        for row in batch:
            bin_id = row.get("bin_id")

            if bin_id not in automatic_logs_by_bin:
                continue

            if row.get("is_manual") is True:
                continue

            if len(automatic_logs_by_bin[bin_id]) < 3:
                automatic_logs_by_bin[bin_id].append(row)

        if (
            all(len(logs) >= 3 for logs in automatic_logs_by_bin.values())
            or len(batch) < page_size
        ):
            break

        start += page_size

    for bin_id in bin_ids:
        automatic_logs = automatic_logs_by_bin[bin_id]

        sensor_status = {}

        for sensor in SENSOR_FIELDS:
            latest_values = [
                row.get(sensor)
                for row in automatic_logs[:3]
            ]

            sensor_status[sensor] = (
                len(latest_values) == 3
                and all(value is not None for value in latest_values)
                and latest_values[0] == latest_values[1] == latest_values[2]
            )

        results[bin_id] = {
            "bin_id": bin_id,
            "needs_maintenance": any(sensor_status.values()),
            "sensors": sensor_status,
            "automatic_readings_checked": len(automatic_logs),
        }

    return results


@app.get("/api/maintenance")
def get_all_maintenance_status(bin_ids: str = ""):
    try:
        if bin_ids.strip():
            requested_bin_ids = [
                int(value.strip())
                for value in bin_ids.split(",")
                if value.strip()
            ]
        else:
            bins_response = supabase.table("bins").select("id").execute()
            requested_bin_ids = [row["id"] for row in bins_response.data]

        return analyze_all_sensor_maintenance(requested_bin_ids)

    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="bin_ids must be a comma-separated list of integers.",
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )

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
            "is_manual": True
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
