"""
Step 7 - Fetching Data from an API
==================================

Goal: Understand how to fetch data through an API.

An API (Application Programming Interface) is the OFFICIAL way to fetch
structured data directly from a data provider's system.

API characteristics:
  - Data is usually in JSON / XML form
  - Stable & structured
  - Faster and more reliable than scraping
  - Often has rate limits & authentication

Here we use a public e-commerce API: https://dummyjson.com/products

Run:
    uv run python steps/07_api.py
"""

import requests

URL = "https://dummyjson.com/products"


def fetch_api_data(limit: int = 10) -> list[dict]:
    # Many APIs accept query parameters, e.g. limit & select
    params = {"limit": limit, "select": "title,price,category,brand"}
    response = requests.get(URL, params=params, timeout=10)
    response.raise_for_status()

    # Convert the response into a Python dict
    data = response.json()
    # dummyjson structure: {"products": [...], "total": ..., ...}
    return data["products"]


def main() -> None:
    products = fetch_api_data(limit=10)
    print(f"=== Successfully fetched {len(products)} products from the API ===")
    for p in products[:5]:
        print(p)


if __name__ == "__main__":
    main()
