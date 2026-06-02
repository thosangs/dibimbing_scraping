"""
PIPELINE LENGKAP - Building Scalable Data Pipelines
===================================================

Menggabungkan semua langkah menjadi satu pipeline utuh, mengikuti alur:

    Scrape beberapa halaman  (BeautifulSoup)
            |
            v
    Buat dictionary list
            |
            v
    Cleaning data            (pandas)
            |
            v
    Buat koneksi database    (SQLite)
            |
            v
    Buat tabel & insert data

Jalankan:
    uv run python pipeline.py
    uv run python pipeline.py --halaman 5
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
CSV_PATH = Path(__file__).resolve().parent / "data" / "produk.csv"


def extract(jumlah_halaman: int) -> list[dict]:
    """Scrape beberapa halaman -> dictionary list (data mentah)."""
    semua: list[dict] = []
    for halaman in range(1, jumlah_halaman + 1):
        url = BASE_URL.format(halaman)
        print(f"[EXTRACT] halaman {halaman}: {url}")
        resp = requests.get(url, timeout=10)
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
    print(f"[EXTRACT] total {len(semua)} produk terkumpul")
    return semua


def transform(data: list[dict]) -> pd.DataFrame:
    """Cleaning data dengan pandas."""
    df = pd.DataFrame(data)
    df["harga"] = df["harga"].apply(lambda x: re.sub(r"[^0-9.]", "", x)).astype(float)
    df["rating"] = df["rating"].map(RATING_MAP)
    df = df.dropna().drop_duplicates().reset_index(drop=True)
    print(f"[TRANSFORM] {len(df)} baris bersih siap disimpan")
    return df


def load(df: pd.DataFrame) -> None:
    """Simpan ke CSV dan database SQLite."""
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)

    # Simpan ke CSV (mudah dicek)
    df.to_csv(CSV_PATH, index=False)
    print(f"[LOAD] CSV tersimpan: {CSV_PATH}")

    # Simpan ke SQLite
    conn = sqlite3.connect(DB_PATH)
    df.to_sql("produk", conn, if_exists="replace", index=False)
    total = conn.execute("SELECT COUNT(*) FROM produk").fetchone()[0]
    conn.close()
    print(f"[LOAD] {total} baris tersimpan ke SQLite: {DB_PATH}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Pipeline scraping e-commerce")
    parser.add_argument(
        "--halaman", type=int, default=3, help="jumlah halaman yang di-scrape"
    )
    args = parser.parse_args()

    print("=" * 55)
    print("MENJALANKAN PIPELINE")
    print("=" * 55)
    data = extract(args.halaman)
    df = transform(data)
    load(df)
    print("=" * 55)
    print("PIPELINE SELESAI")
    print("=" * 55)


if __name__ == "__main__":
    main()
