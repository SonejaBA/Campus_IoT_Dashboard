import os
import time
import random
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_CLIENT = os.getenv("SUPABASE_CLIENT")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_CLIENT, SUPABASE_KEY)

def gather_data() -> tuple[int, int]:
    while True:
        try:
            new_fill = int(input("New fill[0-100]: "))
            new_battery = int(input("New battery[0-100]: "))

            if ((new_fill < 0 or new_fill > 100) or (new_battery < 0 or new_battery > 100)):
                print("Error. Please enter a number in the valid range provided")
            else:
                return new_fill, new_battery
        except ValueError:
            print("Error. Input must be a whole number. ex: [1, 31, 2]")
        except KeyboardInterrupt:
            print("\nCancelled by user via ^C")
            break 


def manual_update():
    print ("Starting input intake for bin updates.")
    response = supabase.table("bins").select("id").execute()
    bins = response.data

    if not bins:
        print("Error: No data found in the 'bins' table.")
        return
    bin_ids = [item["id"] for item in bins]

    while True:
        try:
            target_bin = int(input("Enter a bin to be updated: "))
            if (target_bin in bin_ids):
                new_fill, new_battery = gather_data()

                sensor_payload = {
                    "bin_id": target_bin, 
                    "fill_level": new_fill,
                    "battery_level": new_battery
                }

                supabase.table("telemetry_logs").insert(sensor_payload).execute()

                print(f"Updated Bin ID {target_bin} -> Fill: {new_fill}%, Battery: {new_battery}%")

                break
            else:
                print ("Invalid bin.")
        except ValueError:
            print("Error. Input must be a whole number. ex: [1, 31, 2]")

        except KeyboardInterrupt:
            print("\nCancelled by user via ^C")
            break

def automatic_updates(interval : int):   
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
            
            print(f"Updated Bin ID {target_bin['id']} -> Fill: {new_fill}%, Battery: {new_battery}%")
            
            time.sleep(interval)
            
    except KeyboardInterrupt:
        print("\nSimulator stopped by user.")

def interval_validation() -> int:
    while (True):
        try:
            interval = int(input("Enter an interval between [1-10]: "))
            if (interval < 1 or interval > 10):
                print("Must be between [1-10]")
            else:
                return interval
        except ValueError:
            print("Error. Input must be a whole number. ex: [1, 9, 2]")
            
        except KeyboardInterrupt:
            print("\nCancelled by user via ^C")
            break

def option_picker(option : int):
    if (option == 1):
        manual_update()
    elif (option == 2):
        print("Enter ctrl + c to stop automatic updates")
        interval = interval_validation()
        automatic_updates(interval);

def run_simulator():
    separator = "------------"
    print("Welcome to the bin tracker updater.")
    print("1. Manual updating")
    print("2. Automatic interval updating")
    print("3. Quit")

    while (True):
        try:
            print(separator)
            option_selected = int(input("\nPlease select an option: "))
            if (option_selected < 1 or option_selected > 3):
                print("Invalid option. Please select one of the options provided.")
            elif (option_selected == 3):
                print("Goodbye.")
                break
            else:
                option_picker(option_selected)
        except ValueError:
                print("Error. Input must be a whole number. ex: [1, 2]")
        
        except KeyboardInterrupt:
                print("\nCancelled by user via ^C")
                break
        
if __name__ == "__main__":
    run_simulator()