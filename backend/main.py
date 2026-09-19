from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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