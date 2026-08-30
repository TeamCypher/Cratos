import os
import requests
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("REKA_API_KEY")
print("Key length:", len(api_key) if api_key else 0)

endpoints = [
    "https://api.reka.ai/chat",
    "https://api.reka.ai/v1/chat/completions",
    "https://api.reka.ai/v1/chat",
]

payload = {
    "messages": [{"role": "user", "content": "hi"}],
    "model": "reka-flash"
}

for ep in endpoints:
    print(f"\n--- Testing {ep} ---")
    
    # Try X-Api-Key
    headers = {"Content-Type": "application/json", "X-Api-Key": api_key}
    try:
        r = requests.post(ep, headers=headers, json=payload, timeout=5)
        print(f"X-Api-Key: {r.status_code}")
        if r.status_code == 200:
            print(r.json())
    except Exception as e:
        print(f"Error: {e}")
        
    # Try Authorization: Bearer
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"}
    try:
        r = requests.post(ep, headers=headers, json=payload, timeout=5)
        print(f"Bearer: {r.status_code}")
        if r.status_code == 200:
            print(r.json())
    except Exception as e:
        print(f"Error: {e}")

