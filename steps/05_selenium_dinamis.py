"""
Langkah 5 - Scraping Website Dinamis dengan Selenium
====================================================

Tujuan: Mengambil data dari website yang kontennya di-render oleh JavaScript.

Kenapa butuh Selenium?
  Coba buka https://quotes.toscrape.com/js/ dengan requests + BeautifulSoup,
  hasilnya KOSONG, karena quote-nya dibuat oleh JavaScript di browser.
  Selenium mengontrol browser sungguhan, sehingga JavaScript ikut dijalankan.

Selenium bisa dipakai untuk: klik tombol, scroll, login, dan mengambil data
dari website dinamis.

CATATAN DRIVER:
  Driver di-download OTOMATIS oleh Selenium Manager (bawaan Selenium >= 4.6),
  jadi TIDAK perlu install ChromeDriver manual. Cukup pastikan browser
  Chrome/Chromium sudah terpasang (lihat README).

  Secara default browser akan TERLIHAT (headless=False) supaya kita bisa
  menyaksikan otomasinya saat live coding. Set headless=True kalau ingin
  jalan tanpa membuka jendela browser.

Jalankan:
    uv run python steps/05_selenium_dinamis.py
"""

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

URL = "https://quotes.toscrape.com/js/"


def buat_driver(headless: bool = False) -> webdriver.Chrome:
    options = Options()
    if headless:
        # mode tanpa jendela browser (opsional)
        options.add_argument("--headless=new")
    options.add_argument("--window-size=1920,1080")
    # Selenium Manager otomatis menyiapkan driver yang cocok
    return webdriver.Chrome(options=options)


def main() -> None:
    driver = buat_driver()
    try:
        driver.get(URL)

        # Ambil semua elemen quote di halaman (yang dibuat oleh JavaScript)
        quotes = driver.find_elements(By.CLASS_NAME, "quote")
        print(f"=== Berhasil ambil {len(quotes)} quote dari website dinamis ===")

        for q in quotes[:5]:
            teks = q.find_element(By.CLASS_NAME, "text").text
            penulis = q.find_element(By.CLASS_NAME, "author").text
            print(f"- {teks}  -- {penulis}")
    finally:
        driver.quit()  # selalu tutup browser agar tidak boros memori


if __name__ == "__main__":
    main()
