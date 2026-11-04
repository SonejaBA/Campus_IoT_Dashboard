import asyncio
import re
import getpass
import requests

from bleak import BleakScanner, BleakClient

# ---------------------------------
# CONFIGURATION
# ---------------------------------

DRAGINO_ID = "A84041131F5DD3A8"

NOTIFY_UUID = "0000ffe1-0000-1000-8000-00805f9b34fb"
WRITE_UUID = "0000ffe1-0000-1000-8000-00805f9b34fb"

API_URL = "http://localhost:8000/api/telemetry"

BIN_ID = 128
SENSOR_ID = 2

READ_INTERVAL = 10  # Seconds
SEND_TO_API = True

# ---------------------------------
# BLUETOOTH CONNECTION
# ---------------------------------

async def find_dragino():
    print("Searching for Dragino DDS04...")

    for attempt in range(3):
        devices = await BleakScanner.discover(timeout=15)

        for device in devices:
            if device.name and DRAGINO_ID.lower() in device.name.lower():
                print(f"Found Dragino: {device.name}")
                return device

        print(f"Scan {attempt + 1}: Not found")

    return None


# ---------------------------------
# PARSE SENSOR READING
# ---------------------------------

def extract_distance(message):
    pattern = rf"(?:^|,)\s*{SENSOR_ID}:(\d+)\s*mm"

    match = re.search(pattern, message)

    if not match:
        return None

    distance = int(match.group(1))

    if distance == 0 or distance == 65535:
        print("Invalid sensor reading ignored")
        return None

    return distance


# ---------------------------------
# SEND TO FASTAPI
# ---------------------------------

def send_to_api(distance):
    payload = {
        "bin_id": BIN_ID,
        "sensor_id": SENSOR_ID,
        "distance_mm": distance
    }

    try:
        response = requests.post(
            API_URL,
            json=payload,
            timeout=5
        )

        response.raise_for_status()

        result = response.json()

        print("Sent to FastAPI successfully!")
        print("Landfill fill:", result.get("landfill"), "%")

    except requests.RequestException as error:
        print("FastAPI error:", error)


# ---------------------------------
# MAIN PROGRAM
# ---------------------------------

async def main():

    device = await find_dragino()

    if device is None:
        print("Dragino not found.")
        print("Activate Bluetooth and disconnect DeviceTool.")
        return

    pin = getpass.getpass("Enter Dragino AT PIN: ")

    print("Connecting to Dragino...")

    async with BleakClient(device, timeout=20) as client:

        print("Connected:", client.is_connected)

        buffer = ""
        authenticated = False
        reading_event = asyncio.Event()
        auth_event = asyncio.Event()

        def notification_handler(sender, data):
            nonlocal buffer, authenticated

            message = data.decode(
                "utf-8",
                errors="replace"
            )

            print("Dragino:", message.strip())

            buffer += message

            if "Correct Password" in buffer:
                authenticated = True
                auth_event.set()

            if "Incorrect Password" in buffer:
                auth_event.set()

            if extract_distance(buffer) is not None:
                reading_event.set()

        await client.start_notify(
            NOTIFY_UUID,
            notification_handler
        )

        # Authenticate
        await client.write_gatt_char(
            WRITE_UUID,
            (pin + "\r\n").encode("utf-8"),
            response=False
        )

        try:
            await asyncio.wait_for(
                auth_event.wait(),
                timeout=10
            )
        except asyncio.TimeoutError:
            print("No password confirmation received.")

        if not authenticated:
            print("Authentication not confirmed.")
            return

        print("Authentication successful!")

        # Repeated sensor readings
        while client.is_connected:

            buffer = ""
            reading_event.clear()

            print("\nRequesting Sensor 2 reading...")

            await client.write_gatt_char(
                WRITE_UUID,
                b"AT+GETSENSORVALUE=0\r\n",
                response=False
            )

            try:
                await asyncio.wait_for(
                    reading_event.wait(),
                    timeout=15
                )

                distance = extract_distance(buffer)

                if distance is not None:
                    print(f"Sensor 2 distance: {distance} mm")

                    if SEND_TO_API:
                        await asyncio.to_thread(
                            send_to_api,
                            distance
                        )

            except asyncio.TimeoutError:
                print("No valid distance received.")

            await asyncio.sleep(READ_INTERVAL)

        await client.stop_notify(NOTIFY_UUID)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nStopped by user.")
