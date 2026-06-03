"""
Step 4 - Scrape Several Pages (Pagination)
==========================================

Goal: Extract data from MANY pages using a pagination pattern.

On books.toscrape, page N is located at:
    https://books.toscrape.com/catalogue/page-{N}.html

Strategy:
  - Loop over page numbers 1..N
  - For each page, scrape all products (using the function from Step 3)
  - Combine all results into one big dictionary list

Run:
    uv run python steps/04_bs4_banyak_halaman.py
"""

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://books.toscrape.com/catalogue/page-{}.html"


def scrape_page(url: str) -> list[dict]:
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    response.encoding = "utf-8"  # make sure the currency symbol (£) displays correctly
    soup = BeautifulSoup(response.text, "html.parser")

    products: list[dict] = []
    for item in soup.find_all("article", class_="product_pod"):
        products.append(
            {
                "name": item.find("h3").find("a")["title"],
                "price": item.find("p", class_="price_color").text,
                "rating": item.find("p", class_="star-rating")["class"][1],
                "link": item.find("h3").find("a")["href"],
            }
        )
    return products


def scrape_multiple_pages(page_count: int = 3) -> list[dict]:
    all_products: list[dict] = []
    for page in range(1, page_count + 1):
        url = BASE_URL.format(page)
        print(f"-> Scraping page {page}: {url}")
        products = scrape_page(url)
        all_products.extend(products)
    return all_products


def main() -> None:
    data = scrape_multiple_pages(page_count=3)
    print(f"=== Total {len(data)} products from several pages ===")
    print("First example record:", data[0])
    print("Last example record:", data[-1])


if __name__ == "__main__":
    main()
