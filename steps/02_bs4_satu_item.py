"""
Langkah 2 - Scraping Data dengan BeautifulSoup (Scrape 1 Item)
=============================================================

Tujuan: Mengambil data dari website STATIS menggunakan BeautifulSoup.

BeautifulSoup adalah library Python untuk parsing HTML/XML, sehingga kita
dapat mengambil data berdasarkan tag atau atribut tertentu.

Metode penting:
  - find()      -> mengambil SATU elemen
  - find_all()  -> mengambil BEBERAPA elemen (lihat Langkah 3)

Jalankan:
    uv run python steps/02_bs4_satu_item.py
"""

import requests
from bs4 import BeautifulSoup

URL = "https://books.toscrape.com/"


def main() -> None:
    # 1) Ambil HTML halaman menggunakan requests
    response = requests.get(URL, timeout=10)
    response.raise_for_status()  # error kalau status bukan 200
    response.encoding = "utf-8"  # pastikan simbol mata uang (£) tampil benar

    # 2) Parsing HTML dengan BeautifulSoup
    soup = BeautifulSoup(response.text, "html.parser")

    # 3) Ambil SATU item (produk/buku) pertama dengan find()
    #    Di books.toscrape, setiap buku ada di <article class="product_pod">
    item = soup.find("article", class_="product_pod")

    # 4) Ambil atribut dari item tersebut
    #    - judul ada di atribut "title" pada tag <a> di dalam <h3>
    judul = item.find("h3").find("a")["title"]
    #    - harga ada di <p class="price_color">
    harga = item.find("p", class_="price_color").text
    #    - rating ada di class tag <p>, contoh: "star-rating Three"
    rating = item.find("p", class_="star-rating")["class"][1]
    #    - ketersediaan ada di <p class="instock availability">
    stok = item.find("p", class_="instock availability").text.strip()

    print("=== Scrape 1 Item ===")
    print("Judul   :", judul)
    print("Harga   :", harga)
    print("Rating  :", rating)
    print("Stok    :", stok)


if __name__ == "__main__":
    main()
