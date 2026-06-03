"""
Step 9 - Saving Data to a Database
==================================

Goal: Save the pipeline results to a database.

Activities:
  1. Open a database connection
  2. Create a table
  3. Insert the data

In this class we use TWO options:
  - SQLite   (DEFAULT) -> built into Python, NO server installation needed.
                          Great for quick practice.
  - PostgreSQL (optional) -> matches the example in the guideline. Enable it by
                          installing psycopg2:  uv sync --extra postgres

Run (SQLite by default):
    uv run python steps/09_simpan_database.py
"""

import re
import sqlite3
from pathlib import Path

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://books.toscrape.com/catalogue/page-{}.html"
RATING_MAP = {"One": 1, "Two": 2, "Three": 3, "Four": 4, "Five": 5}

DB_PATH = Path(__file__).resolve().parent.parent / "data" / "ecommerce.db"


def scrape_and_clean(page_count: int = 2) -> list[dict]:
    results: list[dict] = []
    for page in range(1, page_count + 1):
        resp = requests.get(BASE_URL.format(page), timeout=10)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        for item in soup.find_all("article", class_="product_pod"):
            price_text = item.find("p", class_="price_color").text
            results.append(
                {
                    "name": item.find("h3").find("a")["title"],
                    "price": float(re.sub(r"[^0-9.]", "", price_text)),
                    "rating": RATING_MAP.get(
                        item.find("p", class_="star-rating")["class"][1]
                    ),
                }
            )
    return results


# --------------------------------------------------------------------------
# OPTION 1: SQLite (default, no server installation)
# --------------------------------------------------------------------------
def save_to_sqlite(data: list[dict]) -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)

    # 1) Open a database connection
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # 2) Create the table
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS products (
            id     INTEGER PRIMARY KEY AUTOINCREMENT,
            name   TEXT NOT NULL,
            price  REAL,
            rating INTEGER
        )
        """
    )

    # 3) Insert the data
    cur.executemany(
        "INSERT INTO products (name, price, rating) VALUES (:name, :price, :rating)",
        data,
    )

    conn.commit()
    print(f"[SQLite] {len(data)} rows saved to {DB_PATH}")

    # Check the result: fetch the first 5 rows
    for row in cur.execute("SELECT * FROM products LIMIT 5"):
        print(row)

    conn.close()


# --------------------------------------------------------------------------
# OPTION 2: PostgreSQL (optional, matches the guideline example)
#   Enable: uv sync --extra postgres
# --------------------------------------------------------------------------
def get_connection_postgres():
    import psycopg2  # imported inside the function so it is not required to be installed

    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        database="test_db",
        user="postgres",
        password="postgres",
    )
    return conn


def save_to_postgres(data: list[dict]) -> None:
    conn = get_connection_postgres()
    cur = conn.cursor()

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS products (
            id     SERIAL PRIMARY KEY,
            name   TEXT NOT NULL,
            price  NUMERIC,
            rating INTEGER
        )
        """
    )

    cur.executemany(
        "INSERT INTO products (name, price, rating) VALUES (%(name)s, %(price)s, %(rating)s)",
        data,
    )

    conn.commit()
    print(f"[PostgreSQL] {len(data)} rows saved to test_db.products")
    cur.close()
    conn.close()


def main() -> None:
    data = scrape_and_clean(page_count=2)
    print(f"Successfully prepared {len(data)} rows of clean data.\n")

    # Uses SQLite by default. For Postgres, switch to save_to_postgres(data)
    save_to_sqlite(data)


if __name__ == "__main__":
    main()
