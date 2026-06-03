"""
Step 2 - Scraping Data with BeautifulSoup (Scrape 1 Item)
=========================================================

Goal: Extract data from a STATIC website using BeautifulSoup.

BeautifulSoup is a Python library for parsing HTML/XML, so we can extract
data based on specific tags or attributes.

Key methods:
  - find()      -> get ONE element
  - find_all()  -> get SEVERAL elements (see Step 3)

Run:
    uv run python steps/02_bs4_satu_item.py
"""

import requests
from bs4 import BeautifulSoup

URL = "https://books.toscrape.com/"


def main() -> None:
    # 1) Fetch the page HTML using requests
    response = requests.get(URL, timeout=10)
    response.raise_for_status()  # raises an error if the status is not 200
    response.encoding = "utf-8"  # make sure the currency symbol (£) displays correctly

    # 2) Parse the HTML with BeautifulSoup
    soup = BeautifulSoup(response.text, "html.parser")

    # 3) Get the FIRST single item (product/book) with find()
    #    On books.toscrape, each book lives in <article class="product_pod">
    item = soup.find("article", class_="product_pod")

    # 4) Extract attributes from that item
    #    - the title is in the "title" attribute of the <a> tag inside <h3>
    title = item.find("h3").find("a")["title"]
    #    - the price is in <p class="price_color">
    price = item.find("p", class_="price_color").text
    #    - the rating is in the class of the <p> tag, e.g. "star-rating Three"
    rating = item.find("p", class_="star-rating")["class"][1]
    #    - availability is in <p class="instock availability">
    stock = item.find("p", class_="instock availability").text.strip()

    print("=== Scrape 1 Item ===")
    print("Title   :", title)
    print("Price   :", price)
    print("Rating  :", rating)
    print("Stock   :", stock)


if __name__ == "__main__":
    main()
