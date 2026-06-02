"""
Langkah 6 - Menggunakan XPath untuk Mengambil Elemen
====================================================

Tujuan: Memahami cara memilih elemen HTML menggunakan XPath di Selenium.

XPath (XML Path Language) adalah bahasa query untuk menavigasi dan memilih
node/elemen di dalam dokumen HTML/XML (DOM).

Contoh XPath (bisa dicoba di https://scrapinghub.github.io/xpath-playground/):
    //h1                              -> semua tag <h1>
    //p                               -> semua tag <p>
    //p[1]                            -> tag <p> pertama
    //*[@id="first-name"]             -> elemen apa pun dengan id="first-name"
    //p[@class="plot"]                -> <p> dengan class="plot" (persis)
    //p[contains(@class,"plot")]      -> <p> yang class-nya MENGANDUNG "plot"

Di sini kita pakai XPath untuk mengambil quote dari website dinamis,
sebagai alternatif dari By.CLASS_NAME pada Langkah 5.

Jalankan:
    uv run python steps/06_selenium_xpath.py
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

        # XPath: ambil semua <div class="quote">
        quotes = driver.find_elements(By.XPATH, '//div[@class="quote"]')
        print(f"=== Ambil {len(quotes)} quote menggunakan XPath ===")

        for q in quotes[:5]:
            # XPath relatif (diawali ".") -> dicari DI DALAM elemen quote ini
            teks = q.find_element(By.XPATH, './/span[@class="text"]').text
            penulis = q.find_element(By.XPATH, './/small[@class="author"]').text
            print(f"- {teks}  -- {penulis}")

        # Contoh XPath lain: ambil judul halaman <h1> langsung
        judul = driver.find_element(By.XPATH, "//h1").text
        print("\nJudul halaman (//h1):", judul)
    finally:
        driver.quit()


if __name__ == "__main__":
    main()
