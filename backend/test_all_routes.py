import requests
import json
import sys

BASE_URL = "http://localhost:8000/api/v1"

def run_tests():
    print("==========================================")
    print("STARTING FULL BACKEND ENDPOINT VERIFICATION")
    print("==========================================")

    endpoints = [
        ("GET", "/categories"),
        ("GET", "/fundis"),
        ("GET", "/fundis/f1"),
        ("GET", "/bookings"),
        ("GET", "/owner/summary"),
        ("GET", "/owner/earnings-log"),
        ("GET", "/chat/f1"),
        ("GET", "/tracking/BK-9021"),
    ]

    failed = False
    for method, path in endpoints:
        url = f"{BASE_URL}{path}"
        try:
            r = requests.get(url) if method == "GET" else requests.post(url)
            if r.status_code == 200:
                print(f"[OK 200] {method} {path} -> {len(r.content)} bytes")
            else:
                print(f"[FAIL {r.status_code}] {method} {path} -> {r.text}")
                failed = True
        except Exception as e:
            print(f"[ERROR] {method} {path} -> {e}")
            failed = True

    # Test POST /owner/commission
    try:
        r = requests.post(f"{BASE_URL}/owner/commission", json={"rate_percent": 15.0})
        if r.status_code == 200:
            print(f"[OK 200] POST /owner/commission -> {r.json()}")
        else:
            print(f"[FAIL {r.status_code}] POST /owner/commission -> {r.text}")
            failed = True
    except Exception as e:
        print(f"[ERROR] POST /owner/commission -> {e}")
        failed = True

    # Test POST /chat/send
    try:
        msg = {
            "booking_id": "BK-9021",
            "fundi_id": "f1",
            "sender_id": "u1",
            "sender_role": "client",
            "sender_name": "Test Client",
            "receiver_id": "f1",
            "text": "Hello, testing real backend chat!"
        }
        r = requests.post(f"{BASE_URL}/chat/send?auto_reply=false", json=msg)
        if r.status_code == 200:
            print(f"[OK 200] POST /chat/send -> {r.json()}")
        else:
            print(f"[FAIL {r.status_code}] POST /chat/send -> {r.text}")
            failed = True
    except Exception as e:
        print(f"[ERROR] POST /chat/send -> {e}")
        failed = True

    # Test POST /auth/login
    try:
        login_payload = {"email": "alex.kariuki@example.com", "password": "password"}
        r = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
        if r.status_code == 200:
            print(f"[OK 200] POST /auth/login -> User: {r.json().get('user', {}).get('name')}")
        else:
            print(f"[FAIL {r.status_code}] POST /auth/login -> {r.text}")
            failed = True
    except Exception as e:
        print(f"[ERROR] POST /auth/login -> {e}")
        failed = True

    if failed:
        print("\n❌ SOME BACKEND ENDPOINTS FAILED!")
        sys.exit(1)
    else:
        print("\n✅ ALL BACKEND ENDPOINTS ARE WORKING PERFECTLY (100% SUCCESS)!")

if __name__ == "__main__":
    run_tests()
