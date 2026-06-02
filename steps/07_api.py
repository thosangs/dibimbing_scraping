"""
Langkah 7 - Mengambil Data dari API
===================================

Tujuan: Memahami cara mengambil data melalui API.

API (Application Programming Interface) adalah jalur RESMI untuk mengambil
data secara terstruktur langsung dari sistem penyedia data.

Karakteristik API:
  - Data biasanya berbentuk JSON / XML
  - Stabil & terstruktur
  - Lebih cepat dan reliabel dibanding scraping
  - Biasanya ada rate limit & authentication

Di sini kita pakai API e-commerce publik: https://dummyjson.com/products

Jalankan:
    uv run python steps/07_api.py
"""

import requests

URL = "https://dummyjson.com/products"


def ambil_data_api(limit: int = 10) -> list[dict]:
    # Banyak API menerima query parameter, misal limit & select
    params = {"limit": limit, "select": "title,price,category,brand"}
    response = requests.get(URL, params=params, timeout=10)
    response.raise_for_status()

    # Ubah response menjadi dict Python
    data = response.json()
    # Struktur dummyjson: {"products": [...], "total": ..., ...}
    return data["products"]


def main() -> None:
    produk = ambil_data_api(limit=10)
    print(f"=== Berhasil ambil {len(produk)} produk dari API ===")
    for p in produk[:5]:
        print(p)


if __name__ == "__main__":
    main()
