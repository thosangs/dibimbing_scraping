"""
COMPLETE PIPELINE - Web Scraping & API Integration
==================================================

Combines all the steps into one end-to-end pipeline, following this flow:

    Scrape several pages      (BeautifulSoup)
            |
            v
    Build a list of dictionaries
            |
            v
    Clean the data            (pandas)
            |
            v
    Open a database connection (SQLite)
            |
            v
    Create the table & insert the data

Run:
    uv run python pipeline.py
    uv run python pipeline.py --pages 5
"""

import argparse
import re
import sqlite3
from pathlib import Path

import pandas as pd
import requests
from bs4 import BeautifulSoup

BASE_URL = "https://books.toscrape.com/catalogue/page-{}.html"
RATING_MAP = {"One": 1, "Two": 2, "Three": 3, "Four": 4, "Five": 5}
DB_PATH = Path(__file__).resolve().parent / "data" / "ecommerce.db"
CSV_PATH = Path(__file__).resolve().parent / "data" / "products.csv"


def extract(page_count: int) -> list[dict]:
    """Scrape several pages -> list of dictionaries (raw data)."""
    all_products: list[dict] = []
    for page in range(1, page_count + 1):
        url = BASE_URL.format(page)
        print(f"[EXTRACT] page {page}: {url}")
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        for item in soup.find_all("article", class_="product_pod"):
            all_products.append(
                {
                    "name": item.find("h3").find("a")["title"],
                    "price": item.find("p", class_="price_color").text,
                    "rating": item.find("p", class_="star-rating")["class"][1],
                }
            )
    print(f"[EXTRACT] collected {len(all_products)} products in total")
    return all_products


def transform(data: list[dict]) -> pd.DataFrame:
    """Clean the data with pandas."""
    df = pd.DataFrame(data)
    df["price"] = df["price"].apply(lambda x: re.sub(r"[^0-9.]", "", x)).astype(float)
    df["rating"] = df["rating"].map(RATING_MAP)
    df = df.dropna().drop_duplicates().reset_index(drop=True)
    print(f"[TRANSFORM] {len(df)} clean rows ready to be saved")
    return df


def load(df: pd.DataFrame) -> None:
    """Save to CSV and a SQLite database."""
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)

    # Save to CSV (easy to inspect)
    df.to_csv(CSV_PATH, index=False)
    print(f"[LOAD] CSV saved: {CSV_PATH}")

    # Save to SQLite
    conn = sqlite3.connect(DB_PATH)
    df.to_sql("products", conn, if_exists="replace", index=False)
    total = conn.execute("SELECT COUNT(*) FROM products").fetchone()[0]
    conn.close()
    print(f"[LOAD] {total} rows saved to SQLite: {DB_PATH}")


def main() -> None:
    parser = argparse.ArgumentParser(description="E-commerce scraping pipeline")
    parser.add_argument(
        "--pages", type=int, default=3, help="number of pages to scrape"
    )
    args = parser.parse_args()

    print("=" * 55)
    print("RUNNING PIPELINE")
    print("=" * 55)
    data = extract(args.pages)
    df = transform(data)
    load(df)
    print("=" * 55)
    print("PIPELINE COMPLETE")
    print("=" * 55)


if __name__ == "__main__":
    main()
