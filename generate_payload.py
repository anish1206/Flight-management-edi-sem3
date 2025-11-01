# generate_payload.py
import json

# This creates the exact data structure we need
data = {"data": [[0] * 18] * 50}

# This writes it to a file as a perfectly formatted JSON string
with open("test_payload.json", "w") as f:
    json.dump(data, f)

print("test_payload.json created successfully!")