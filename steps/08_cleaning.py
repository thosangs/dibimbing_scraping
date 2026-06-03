"""
Step 8 - Cleaning Data
======================

Goal: Clean the data before saving it to the database.

Activities:
  1. Remove empty / duplicate records
  2. Reformat data (e.g. price "£51.77" -> 51.77 as a float)
  3. Remove unnecessary characters

Here we scrape raw data from books.toscrape, then clean it using pandas.

Run:
    uv run python steps/08_cleaning.py
"""

import re

import pandas as pd
import requests
from bs4 import BeautifulSoup

BASE_URL = "https://books.toscrape.com/catalogue/page-{}.html"

# Convert the text rating (Three) -> a number (3)
RATING_MAP = {"One": 1, "Two": 2, "Three": 3, "Four": 4, "Five": 5}


def scrape_multiple_pages(page_count: int = 2) -> list[dict]:
    all_products: list[dict] = []
    for page in range(1, page_count + 1):
        resp = requests.get(BASE_URL.format(page), timeout=10)
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
    return all_products


def clean(data: list[dict]) -> pd.DataFrame:
    # 1) Load into a DataFrame
    df = pd.DataFrame(data)

    # 2) Clean the price column: "£51.77" -> 51.77 (float)
    #    Remove every character except digits and the dot
    df["price"] = (
        df["price"]
        .apply(lambda x: re.sub(r"[^0-9.]", "", x))
        .astype(float)
    )

    # 3) Convert the text rating into a number
    df["rating"] = df["rating"].map(RATING_MAP)

    # 4) Drop rows with empty values & duplicate records
    df = df.dropna().drop_duplicates().reset_index(drop=True)

    return df


def main() -> None:
    raw_data = scrape_multiple_pages(page_count=2)
    print("=== RAW data (3 examples) ===")
    for d in raw_data[:3]:
        print(d)

    df = clean(raw_data)
    print("\n=== Data AFTER cleaning ===")
    print(df.head())
    print("\nData type of each column:")
    print(df.dtypes)


if __name__ == "__main__":
    main()
