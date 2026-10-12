import os
import json
import urllib.request
from pathlib import Path

api_key = os.environ.get("JULES_API_KEY")
if not api_key:
    print("[ERROR] JULES_API_KEY environment variable is missing.")
    exit(1)

log_content = ""
log_file = Path("test_output.log")
if log_file.exists():
    lines = log_file.read_text(encoding="utf-8", errors="ignore").splitlines()
    log_content = "\n".join(lines[-35:])

prompt = (
    "The scraping contract tests in tests/test_scrapers.py failed with:\n\n"
    f"{log_content}\n\n"
    "Please inspect src/cloud_functions/newsAggregator.ts and tests/test_scrapers.py:\n"
    "1. Fix the EAC URL/endpoint (it currently returns 404).\n"
    "2. Update the regex or parsing logic for CERA to match the live markup so articles are extracted.\n"
    "3. Verify all tests in tests/ pass."
)

payload = {
    "title": "self-healing-scraper-failure",
    "prompt": prompt,
    "sourceContext": {
        "source": "sources/github/maximkolos88-arch/energeia-cy",
        "githubRepoContext": {
            "startingBranch": "main"
        }
    },
    "automationMode": "AUTO_CREATE_PR"
}

req = urllib.request.Request(
    "https://jules.googleapis.com/v1alpha/sessions",
    data=json.dumps(payload).encode("utf-8"),
    headers={
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key
    },
    method="POST"
)

try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        print(f"[SUCCESS] Dispatched to Jules API: HTTP {resp.status}")
        print(resp.read().decode("utf-8"))
except urllib.error.HTTPError as e:
    print(f"[ERROR] HTTP {e.code}: {e.read().decode('utf-8')}")
    exit(1)
