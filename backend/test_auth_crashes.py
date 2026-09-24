import requests
import os
import sys

BASE_URL = "http://localhost:8000/api/v1"

def test_auth_flows():
    print("==========================================")
    print("STARTING AUTHENTICATION & CRASH TEST SUITE")
    print("==========================================")

    failed = False

    # 1. Case-insensitive login with whitespace
    print("\n[1] Testing Case-Insensitive Login & Whitespace...")
    login_cases = [
        ("  ALEX.KARIUKI@EXAMPLE.COM  ", "password ", 200, "Alex Kariuki"),
        ("John.Mboya@PataFundi.com", "password", 200, "John Mboya"),
        ("OWNER@PATAFUNDI.COM", "password", 200, "PataFundi Platform Owner"),
    ]
    for email, pwd, expected_status, expected_name in login_cases:
        res = requests.post(f"{BASE_URL}/auth/login", json={"email": email, "password": pwd})
        if res.status_code == expected_status and res.json().get("user", {}).get("name") == expected_name:
            print(f"  ✓ SUCCESS: Login for '{email.strip()}' returned user '{expected_name}'")
        else:
            print(f"  ✗ FAILED: Login for '{email}' -> Status {res.status_code}, Body: {res.text}")
            failed = True

    # 2. Invalid password login (should return 401 without crashing)
    print("\n[2] Testing Invalid Credentials Handling...")
    res = requests.post(f"{BASE_URL}/auth/login", json={"email": "alex.kariuki@example.com", "password": "wrongpassword"})
    if res.status_code == 401:
        print(f"  ✓ SUCCESS: Invalid login safely returned 401 ({res.json().get('detail')})")
    else:
        print(f"  ✗ FAILED: Invalid login returned status {res.status_code}")
        failed = True

    # 3. Register client user
    print("\n[3] Testing Client Registration...")
    client_payload = {
        "name": "Jane Doe",
        "email": "jane.doe@example.com",
        "phone": "+254711999888",
        "password": "mypassword123",
        "role": "client"
    }
    res = requests.post(f"{BASE_URL}/auth/register", json=client_payload)
    if res.status_code == 200 and "accessToken" in res.json():
        print(f"  ✓ SUCCESS: Client registered, user ID: {res.json()['user']['id']}")
    else:
        print(f"  ✗ FAILED: Client registration -> Status {res.status_code}, Body: {res.text}")
        failed = True

    # 4. Register fundi with NEW/UNSEEDED Category (verifies foreign key & dynamic category handling)
    print("\n[4] Testing Fundi Registration with Dynamic Category...")
    fundi_payload = {
        "name": "Kiprono Solar",
        "email": "kiprono.solar@example.com",
        "phone": "+254722000111",
        "password": "solarpassword",
        "role": "fundi",
        "category": "Solar & Renewable Energy",
        "experienceYears": 5,
        "hourlyRate": 2000
    }
    res = requests.post(f"{BASE_URL}/auth/register", json=fundi_payload)
    if res.status_code == 200 and "accessToken" in res.json():
        user = res.json()["user"]
        print(f"  ✓ SUCCESS: Fundi registered with category 'Solar & Renewable Energy', Fundi ID: {user.get('fundiId')}")
    else:
        print(f"  ✗ FAILED: Fundi registration -> Status {res.status_code}, Body: {res.text}")
        failed = True

    # 5. Duplicate Email Registration (should return 400 without crashing)
    print("\n[5] Testing Duplicate Email Registration...")
    res = requests.post(f"{BASE_URL}/auth/register", json=client_payload)
    if res.status_code == 400:
        print(f"  ✓ SUCCESS: Duplicate registration safely returned 400 ({res.json().get('detail')})")
    else:
        print(f"  ✗ FAILED: Duplicate registration returned status {res.status_code}")
        failed = True

    if failed:
        print("\n❌ TEST SUITE FAILED!")
        sys.exit(1)
    else:
        print("\n✅ ALL AUTHENTICATION & CRASH TESTS PASSED PERFECTLY!")

if __name__ == "__main__":
    test_auth_flows()
