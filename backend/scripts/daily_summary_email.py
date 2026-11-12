import os
from datetime import datetime, timezone
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_CLIENT")  # or SUPABASE_URL depending on your environment
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def check_email_notifications_enabled() -> bool:
    try:
        # Replace 'profiles' with your actual user/profile table name
        response = supabase.table("profiles").select("email_notifications").limit(1).single().execute()
        if response.data and response.data.get("email_notifications") is True:
            return True
    except Exception as e:
        print(f"Error checking notification settings: {e}")
    # When testing, you can manually set this to True or False to simulate the setting being enabled or disabled.
    return False

# Fetch critical bins from the database (PLEASE NOTE: Adjust the table name and column names as per your actual database schema)
def fetch_critical_bins() -> list:
    try:
        # Replace 'bin_id', 'location_description', 'zone', 'fill_level' 
        # with the exact column names from your Supabase database table
        response = supabase.table("bins").select("id, location, zone, fill_level").gte("fill_level", 80).execute()
        return response.data if response.data else []
    except Exception as e:
        print(f"Error fetching critical bins: {e}")
        return []

def group_bins_by_zone(bins: list) -> dict:
    """
    Groups a list of critical bins by their campus zone.
    """
    grouped = {}
    for b in bins:
        zone = b.get("zone", "Unassigned Zone")
        if zone not in grouped:
            grouped[zone] = []
        grouped[zone].append({
            "bin_id": b.get("bin_id"),
            "description": b.get("location_description")
        })
    return grouped

def send_daily_summary_email(grouped_bins: dict):
    """
    Formats the email body containing the list of critical bins separated by zones.
    """
    if not grouped_bins:
        print("No critical bins needing servicing today. Skipping email.")
        return

    # Build the daily summary email body
    email_body = f"Daily Critical Bins Summary — {datetime.now(timezone.utc).strftime('%Y-%m-%d')}\n\n"
    for zone, bins in grouped_bins.items():
        email_body += f"=== Zone: {zone} ===\n"
        for b in bins:
            email_body += f"- Bin ID: {b['bin_id']} | Location: {b['description']}\n"
        email_body += "\n"

    print("--- Prepared Daily Summary Email ---")
    print(email_body)
    print("------------------------------------")
    
    # TODO: Plug in your email delivery provider (e.g., SendGrid, Resend, or SMTP server) here


def run_daily_critical_bins_job():
    """
    Main job runner: Verifies settings toggle first before running data fetches or sending emails.
    """
    print("Running daily critical bins summary check...")
    
    # GUARD: Only proceed if email notifications are explicitly enabled in settings
    if not check_email_notifications_enabled():
        print("Email notifications setting is disabled (opted-out). Skipping daily summary email.")
        return

    # If enabled, proceed with gathering and summarizing critical bins
    critical_bins = fetch_critical_bins()
    grouped = group_bins_by_zone(critical_bins)
    send_daily_summary_email(grouped)


if __name__ == "__main__":
    run_daily_critical_bins_job()