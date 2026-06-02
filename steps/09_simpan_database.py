"""
Langkah 9 - Menyimpan Data ke Database
======================================

Tujuan: Menyimpan hasil pipeline ke database.

Aktivitas:
  1. Membuat koneksi database
  2. Membuat tabel
  3. Memasukkan (insert) data

Di kelas ini kita pakai DUA pilihan:
  - SQLite   (DEFAULT) -> bawaan Python, TIDAK perlu install server apa pun.
                          Cocok untuk latihan cepat.
  - PostgreSQL (opsional) -> sesuai contoh di guideline. Aktifkan dengan
                          install psycopg2:  uv sync --extra postgres

Jalankan (default SQLite):
    uv run python steps/09_simpan_database.py
"""

import re
import sqlite3
from pathlib import Path

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://books.toscrape.com/catalogue/page-{}.html"
RATING_MAP = {"One": 1, "Two": 2, "Three": 3, "Four": 4, "Five": 5}

DB_PATH = Path(__file__).resolve().parent.parent / "data" / "ecommerce.db"


def scrape_dan_bersihkan(jumlah_halaman: int = 2) -> list[dict]:
    hasil: list[dict] = []
    for halaman in range(1, jumlah_halaman + 1):
        resp = requests.get(BASE_URL.format(halaman), timeout=10)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        for item in soup.find_all("article", class_="product_pod"):
            harga_teks = item.find("p", class_="price_color").text
            hasil.append(
                {
                    "nama": item.find("h3").find("a")["title"],
                    "harga": float(re.sub(r"[^0-9.]", "", harga_teks)),
                    "rating": RATING_MAP.get(
                        item.find("p", class_="star-rating")["class"][1]
                    ),
                }
            )
    return hasil


# --------------------------------------------------------------------------
# PILIHAN 1: SQLite (default, tanpa install server)
# --------------------------------------------------------------------------
def simpan_sqlite(data: list[dict]) -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)

    # 1) Membuat koneksi database
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # 2) Membuat tabel
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS produk (
            id     INTEGER PRIMARY KEY AUTOINCREMENT,
            nama   TEXT NOT NULL,
            harga  REAL,
            rating INTEGER
        )
        """
    )

    # 3) Memasukkan data
    cur.executemany(
        "INSERT INTO produk (nama, harga, rating) VALUES (:nama, :harga, :rating)",
        data,
    )

    conn.commit()
    print(f"[SQLite] {len(data)} baris tersimpan ke {DB_PATH}")

    # Cek hasil: ambil 5 baris pertama
    for row in cur.execute("SELECT * FROM produk LIMIT 5"):
        print(row)

    conn.close()


# --------------------------------------------------------------------------
# PILIHAN 2: PostgreSQL (opsional, sesuai contoh guideline)
#   Aktifkan: uv sync --extra postgres
# --------------------------------------------------------------------------
def get_connection_postgres():
    import psycopg2  # diimport di dalam fungsi agar tidak wajib terpasang

    conn = psycopg2.connect(
        host="localhost",
        port=5432,
        database="test_db",
        user="postgres",
        password="postgres",
    )
    return conn


def simpan_postgres(data: list[dict]) -> None:
    conn = get_connection_postgres()
    cur = conn.cursor()

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS produk (
            id     SERIAL PRIMARY KEY,
            nama   TEXT NOT NULL,
            harga  NUMERIC,
            rating INTEGER
        )
        """
    )

    cur.executemany(
        "INSERT INTO produk (nama, harga, rating) VALUES (%(nama)s, %(harga)s, %(rating)s)",
        data,
    )

    conn.commit()
    print(f"[PostgreSQL] {len(data)} baris tersimpan ke test_db.produk")
    cur.close()
    conn.close()


def main() -> None:
    data = scrape_dan_bersihkan(jumlah_halaman=2)
    print(f"Berhasil siapkan {len(data)} baris data bersih.\n")

    # Default pakai SQLite. Untuk Postgres, ganti ke simpan_postgres(data)
    simpan_sqlite(data)


if __name__ == "__main__":
    main()
