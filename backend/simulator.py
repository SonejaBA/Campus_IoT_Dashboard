import os
import time
import random
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_CLIENT = os.getenv("SUPABASE_CLIENT")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_CLIENT, SUPABASE_KEY)

def run_simulator():
    print ("Running fake updates for supabase table.")

    response = supabase.table("bins").select("id").execute()
    bins = response.data

    if not bins:
        print("Error: No data found in the 'bins' table.")
        return

    try:
        while True:
            # Pick a random bin from the list
            target_bin = random.choice(bins)
            
            # Generate simulated sensor data
            new_fill = random.randint(0, 100)
            new_battery = random.randint(50, 100) 
            
            sensor_payload = {
                "bin_id": target_bin["id"], 
                "fill_level": new_fill,
                "battery_level": new_battery
            }
            
            supabase.table("telemetry_logs").insert(sensor_payload).execute()
            
            print(f"Pinged Bin ID {target_bin['id']} -> Fill: {new_fill}%, Battery: {new_battery}%")
            
            time.sleep(4)
            
    except KeyboardInterrupt:
        print("\nSimulator stopped by user.")

if __name__ == "__main__":
    run_simulator()