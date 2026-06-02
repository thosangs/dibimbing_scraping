"""
Langkah 3 - Scrape Beberapa Item dalam Satu Halaman
===================================================

Tujuan: Mengambil BANYAK data dari satu halaman, lalu menyimpannya dalam
bentuk DICTIONARY LIST (list berisi dictionary).

Aktivitas:
  1. Mengambil semua elemen produk dengan find_all()
  2. Mengambil atribut: nama, harga, rating, link
  3. Menyimpan tiap produk sebagai dictionary, dikumpulkan ke dalam list

Jalankan:
    uv run python steps/03_bs4_satu_halaman.py
"""

import requests
from bs4 import BeautifulSoup

URL = "https://books.toscrape.com/"


def scrape_halaman(url: str) -> list[dict]:
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    response.encoding = "utf-8"  # pastikan simbol mata uang (£) tampil benar
    soup = BeautifulSoup(response.text, "html.parser")

    produk: list[dict] = []

    # find_all() -> ambil SEMUA buku di halaman ini
    for item in soup.find_all("article", class_="product_pod"):
        nama = item.find("h3").find("a")["title"]
        harga = item.find("p", class_="price_color").text
        rating = item.find("p", class_="star-rating")["class"][1]
        link = item.find("h3").find("a")["href"]

        produk.append(
            {
                "nama": nama,
                "harga": harga,
                "rating": rating,
                "link": link,
            }
        )

    return produk


def main() -> None:
    data = scrape_halaman(URL)
    print(f"=== Berhasil scrape {len(data)} produk dari 1 halaman ===")
    for p in data[:5]:  # tampilkan 5 contoh pertama
        print(p)
    print("...")


if __name__ == "__main__":
    main()
