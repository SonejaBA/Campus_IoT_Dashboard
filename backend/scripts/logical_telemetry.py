import os
import random
import math
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_CLIENT = os.getenv("SUPABASE_CLIENT")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_CLIENT, SUPABASE_KEY)

def find_start_time(steps) -> datetime:
    #each step is 4 hours since "sensors" ping every 4 hours
    now = datetime.now(timezone.utc)
    amount_to_deduct = timedelta(hours=4 * steps)

    
    starting_point = (now - amount_to_deduct)
    return starting_point


def count_validation() -> int:
    while (True):
        try:
            interval = int(input("How many updates do you want per bin[1-100]: "))
            if (interval < 1 or interval > 100):
                print("Must be between [1-100]")
            else:
                return interval
        except ValueError:
            print("Error. Input must be a whole number. ex: [1, 9, 2]")
            
        except KeyboardInterrupt:
            print("\nCancelled by user via ^C")
            break


def run_simulator():
    count_per_bin = count_validation()

    response = supabase.table("bins").select("id").execute()
    bins = response.data

    if not bins:
        print("Error: No data found in the 'bins' table.")
        return

    for bin in bins:
        previous_battery = 100.0
        prev_compost = random.randint(0, 60)
        prev_landfill = random.randint(0, 60)
        prev_recycle = random.randint(0, 60)

        start_time = find_start_time(count_per_bin)

        batch_payload = []

        for _ in range(count_per_bin):
            #generate a random float
            battery_degradation = random.random()
            updated_battery = previous_battery - battery_degradation if previous_battery - battery_degradation > 0 else 0
            battery_payload = math.floor(updated_battery) 

            previous_battery = updated_battery

            updated_compost = prev_compost + random.randint(0, 8)
            updated_landfill = prev_landfill + random.randint(0, 15)
            updated_recycle = prev_recycle + random.randint(0, 12)

            # Determine overall fill level (highest of the three)
            max_fill = max(updated_compost, updated_landfill, updated_recycle)

            
            if max_fill >= 90:
                updated_compost = 0
                updated_landfill = 0
                updated_recycle = 0
                max_fill = 0

            # Store states for the next iteration
            prev_compost = updated_compost
            prev_landfill = updated_landfill
            prev_recycle = updated_recycle

            sensor_payload = {
                "bin_id": bin["id"],
                "compost": updated_compost,
                "landfill": updated_landfill,
                "recycle": updated_recycle,
                "fill_level": max_fill, 
                "battery_level": battery_payload,
                "time" : start_time.isoformat()
            }

            #add four hours to time
            start_time = start_time + timedelta(hours=4)
            batch_payload.append(sensor_payload)

        supabase.table("telemetry_logs").insert(batch_payload).execute()
            

    
        
if __name__ == "__main__":
    run_simulator()