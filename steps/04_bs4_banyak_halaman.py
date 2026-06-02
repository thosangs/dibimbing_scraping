"""
Langkah 4 - Scrape Beberapa Halaman (Pagination)
================================================

Tujuan: Mengambil data dari BANYAK halaman menggunakan pola pagination.

Di books.toscrape, halaman ke-N ada di:
    https://books.toscrape.com/catalogue/page-{N}.html

Strategi:
  - Looping nomor halaman 1..N
  - Untuk tiap halaman, scrape semua produk (pakai fungsi dari Langkah 3)
  - Gabungkan semua hasil ke dalam satu dictionary list besar

Jalankan:
    uv run python steps/04_bs4_banyak_halaman.py
"""

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://books.toscrape.com/catalogue/page-{}.html"


def scrape_halaman(url: str) -> list[dict]:
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    response.encoding = "utf-8"  # pastikan simbol mata uang (£) tampil benar
    soup = BeautifulSoup(response.text, "html.parser")

    produk: list[dict] = []
    for item in soup.find_all("article", class_="product_pod"):
        produk.append(
            {
                "nama": item.find("h3").find("a")["title"],
                "harga": item.find("p", class_="price_color").text,
                "rating": item.find("p", class_="star-rating")["class"][1],
                "link": item.find("h3").find("a")["href"],
            }
        )
    return produk


def scrape_banyak_halaman(jumlah_halaman: int = 3) -> list[dict]:
    semua_produk: list[dict] = []
    for halaman in range(1, jumlah_halaman + 1):
        url = BASE_URL.format(halaman)
        print(f"-> Scraping halaman {halaman}: {url}")
        produk = scrape_halaman(url)
        semua_produk.extend(produk)
    return semua_produk


def main() -> None:
    data = scrape_banyak_halaman(jumlah_halaman=3)
    print(f"=== Total {len(data)} produk dari beberapa halaman ===")
    print("Contoh data pertama:", data[0])
    print("Contoh data terakhir:", data[-1])


if __name__ == "__main__":
    main()
