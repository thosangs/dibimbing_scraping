"""
Langkah 1 - Memahami Data Pipeline
==================================

Tujuan: Memahami alur dasar pipeline dalam proyek data engineering.

Data pipeline adalah alur OTOMATIS untuk memindahkan data dari SUMBER ke
TUJUAN, melalui proses yang TERSTRUKTUR dan DAPAT DIULANG (repeatable).

Pada project ini, pipeline akan mengikuti alur seperti di bawah ini.
Jalankan file ini untuk melihat gambaran alurnya:

    uv run python steps/01_pipeline_overview.py
"""

ALUR = [
    "Scrape 1 item",
    "Scrape 1 halaman",
    "Buat Dictionary List",
    "Scrape Beberapa Halaman",
    "Cleaning Data",
    "Buat Koneksi ke Database",
    "Buat Tabel dan Input Data",
]


def tampilkan_alur() -> None:
    print("=" * 50)
    print("ALUR PROJECT: Building Scalable Data Pipelines")
    print("=" * 50)
    for i, tahap in enumerate(ALUR, start=1):
        print(f"  [{i}] {tahap}")
        if i < len(ALUR):
            print("        |")
            print("        v")
    print("=" * 50)
    print("Sumber data yang dipakai di kelas ini:")
    print("  - Static  (BeautifulSoup) : https://books.toscrape.com")
    print("  - Dinamis (Selenium)      : https://quotes.toscrape.com/js")
    print("  - API                     : https://dummyjson.com/products")
    print("=" * 50)


if __name__ == "__main__":
    tampilkan_alur()
