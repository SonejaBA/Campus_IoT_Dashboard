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
        previous_fill = random.randint(1,100)
        start_time = find_start_time(count_per_bin)

        for _ in range(count_per_bin):
            #generate a random float
            battery_degredation = random.random()
            updated_battery = previous_battery - battery_degredation if previous_battery - battery_degredation > 0 else 0
            battery_payload = math.floor(updated_battery) 

            previous_battery = updated_battery

            added_trash = random.randint(1, 15)
            updated_fill = previous_fill + added_trash if previous_fill + added_trash <= 100 else 0

            previous_fill = updated_fill

            sensor_payload = {
                "bin_id": bin["id"],
                "fill_level": updated_fill,
                "battery_level": battery_payload,
                #supabase take iso 8601
                "time" : start_time.isoformat()
            }

            #add four hours to time
            start_time = start_time + timedelta(hours=4)

            supabase.table("telemetry_logs").insert(sensor_payload).execute()

    
        
if __name__ == "__main__":
    run_simulator()