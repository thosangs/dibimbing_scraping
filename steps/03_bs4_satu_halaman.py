"""
Step 3 - Scrape Several Items on a Single Page
==============================================

Goal: Extract MANY records from a single page, then store them as a
DICTIONARY LIST (a list of dictionaries).

Activities:
  1. Get all product elements with find_all()
  2. Extract attributes: name, price, rating, link
  3. Store each product as a dictionary, collected into a list

Run:
    uv run python steps/03_bs4_satu_halaman.py
"""

import requests
from bs4 import BeautifulSoup

URL = "https://books.toscrape.com/"


def scrape_page(url: str) -> list[dict]:
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    response.encoding = "utf-8"  # make sure the currency symbol (£) displays correctly
    soup = BeautifulSoup(response.text, "html.parser")

    products: list[dict] = []

    # find_all() -> get ALL books on this page
    for item in soup.find_all("article", class_="product_pod"):
        name = item.find("h3").find("a")["title"]
        price = item.find("p", class_="price_color").text
        rating = item.find("p", class_="star-rating")["class"][1]
        link = item.find("h3").find("a")["href"]

        products.append(
            {
                "name": name,
                "price": price,
                "rating": rating,
                "link": link,
            }
        )

    return products


def main() -> None:
    data = scrape_page(URL)
    print(f"=== Successfully scraped {len(data)} products from 1 page ===")
    for p in data[:5]:  # show the first 5 examples
        print(p)
    print("...")


if __name__ == "__main__":
    main()
