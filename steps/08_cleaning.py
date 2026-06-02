"""
Langkah 8 - Cleaning Data
=========================

Tujuan: Membersihkan data sebelum disimpan ke database.

Aktivitas:
  1. Menghapus data kosong / duplikat
  2. Mengubah format data (contoh: harga "£51.77" -> 51.77 bertipe float)
  3. Menghapus karakter yang tidak diperlukan

Di sini kita scrape data mentah dari books.toscrape, lalu bersihkan
menggunakan pandas.

Jalankan:
    uv run python steps/08_cleaning.py
"""

import re

import pandas as pd
import requests
from bs4 import BeautifulSoup

BASE_URL = "https://books.toscrape.com/catalogue/page-{}.html"

# Konversi rating teks (Three) -> angka (3)
RATING_MAP = {"One": 1, "Two": 2, "Three": 3, "Four": 4, "Five": 5}


def scrape_banyak_halaman(jumlah_halaman: int = 2) -> list[dict]:
    semua: list[dict] = []
    for halaman in range(1, jumlah_halaman + 1):
        resp = requests.get(BASE_URL.format(halaman), timeout=10)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        for item in soup.find_all("article", class_="product_pod"):
            semua.append(
                {
                    "nama": item.find("h3").find("a")["title"],
                    "harga": item.find("p", class_="price_color").text,
                    "rating": item.find("p", class_="star-rating")["class"][1],
                }
            )
    return semua


def bersihkan(data: list[dict]) -> pd.DataFrame:
    # 1) Masukkan ke DataFrame
    df = pd.DataFrame(data)

    # 2) Bersihkan kolom harga: "£51.77" -> 51.77 (float)
    #    Hapus semua karakter selain angka dan titik
    df["harga"] = (
        df["harga"]
        .apply(lambda x: re.sub(r"[^0-9.]", "", x))
        .astype(float)
    )

    # 3) Ubah rating teks menjadi angka
    df["rating"] = df["rating"].map(RATING_MAP)

    # 4) Hapus baris yang ada nilai kosong & data duplikat
    df = df.dropna().drop_duplicates().reset_index(drop=True)

    return df


def main() -> None:
    mentah = scrape_banyak_halaman(jumlah_halaman=2)
    print("=== Data MENTAH (3 contoh) ===")
    for d in mentah[:3]:
        print(d)

    df = bersihkan(mentah)
    print("\n=== Data SETELAH cleaning ===")
    print(df.head())
    print("\nTipe data tiap kolom:")
    print(df.dtypes)


if __name__ == "__main__":
    main()
