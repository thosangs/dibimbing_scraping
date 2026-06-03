<p align="center">
  <img src="docs/assets/banner.svg" alt="Building Scalable Data Pipelines" width="100%" />
</p>

<h1 align="center">Building Scalable Data Pipelines</h1>

<p align="center">
  <b>Hands-on Data Engineering</b><br/>
  Web Scraping (BeautifulSoup + Selenium + XPath) & API Integration untuk E-Commerce
</p>

<p align="center">
  <img alt="Python" src="https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white" />
  <img alt="uv" src="https://img.shields.io/badge/managed%20with-uv-261230?logo=uv&logoColor=white" />
  <img alt="BeautifulSoup" src="https://img.shields.io/badge/BeautifulSoup-4-43B02A" />
  <img alt="Selenium" src="https://img.shields.io/badge/Selenium-4-43B02A?logo=selenium&logoColor=white" />
  <img alt="pandas" src="https://img.shields.io/badge/pandas-2-150458?logo=pandas&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/license-Apache--2.0-blue" />
</p>

<p align="center">
  <a href="https://thosangs.github.io/dibimbing_scraping/"><b>🌐 Live Site (GitHub Pages)</b></a> ·
  <a href="#menjalankan-tiap-langkah"><b>🪜 Materi Step-by-Step</b></a> ·
  <a href="#persiapan-pakai-uv"><b>🚀 Quickstart</b></a>
</p>

---

Project ini disusun **step-by-step** mengikuti slide/guideline kelas. Tiap langkah
adalah satu file yang bisa dijalankan sendiri, jadi enak dipakai untuk mengajar
sambil _live coding_.

---

## Alur Pipeline

```
Scrape 1 item -> Scrape 1 halaman -> Buat Dictionary List -> Scrape Beberapa Halaman
   -> Cleaning Data -> Buat Koneksi Database -> Buat Tabel & Input Data
```

## Sumber Data

| Teknik              | Website                              | Keterangan                    |
| ------------------- | ------------------------------------ | ----------------------------- |
| BeautifulSoup (statis) | https://books.toscrape.com        | Toko buku (sandbox scraping)  |
| Selenium (dinamis)  | https://quotes.toscrape.com/js       | Konten dibuat oleh JavaScript |
| API                 | https://dummyjson.com/products       | API e-commerce publik         |
| XPath playground    | https://scrapinghub.github.io/xpath-playground/ | Latihan XPath      |

---

## Persiapan (pakai UV)

> Project ini memakai **[uv](https://docs.astral.sh/uv/)** sebagai package & environment manager.
> uv akan otomatis menyiapkan Python 3.12 dan semua library, tanpa ribet `venv` manual.

### 1. Install uv (kalau belum ada)

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 2. Install semua dependency

```bash
uv sync
```

Itu saja. uv membuat virtual environment di `.venv/` dan menginstall
`requests`, `beautifulsoup4`, `lxml`, `selenium`, dan `pandas`.

### 3. (Opsional) Untuk PostgreSQL

```bash
uv sync --extra postgres
```

---

## Setup untuk Selenium

### 1. Install browser (Chrome/Chromium)

Selenium butuh browser sungguhan. Pastikan **Google Chrome** atau **Chromium**
sudah terpasang di komputer. Kalau sudah biasa pakai Chrome, tidak perlu
install apa-apa lagi.

### 2. Driver TIDAK perlu diinstall manual

Selenium >= 4.6 punya **Selenium Manager** yang otomatis men-download
ChromeDriver/GeckoDriver yang cocok dengan versi browser. Jadi tidak ada
langkah install ChromeDriver manual — ini alasan kita pakai setup ini biar
gampang.

> Secara default browser akan **terlihat** saat dijalankan, jadi kita bisa
> menyaksikan otomasinya saat demo. Kalau ingin jalan tanpa membuka jendela
> browser, panggil `buat_driver(headless=True)` di dalam script Selenium.

---

## Menjalankan Tiap Langkah

Jalankan dengan `uv run` (uv otomatis pakai environment yang benar):

| Langkah | Materi                                  | Perintah                                          |
| ------- | --------------------------------------- | ------------------------------------------------- |
| 1       | Memahami Data Pipeline                  | `uv run python steps/01_pipeline_overview.py`     |
| 2       | BeautifulSoup - scrape 1 item           | `uv run python steps/02_bs4_satu_item.py`         |
| 3       | BeautifulSoup - 1 halaman (dict list)   | `uv run python steps/03_bs4_satu_halaman.py`      |
| 4       | BeautifulSoup - beberapa halaman        | `uv run python steps/04_bs4_banyak_halaman.py`    |
| 5       | Selenium - website dinamis              | `uv run python steps/05_selenium_dinamis.py`      |
| 6       | Selenium - XPath                        | `uv run python steps/06_selenium_xpath.py`        |
| 7       | API                                     | `uv run python steps/07_api.py`                   |
| 8       | Cleaning data (pandas)                  | `uv run python steps/08_cleaning.py`              |
| 9       | Simpan ke database (SQLite/Postgres)    | `uv run python steps/09_simpan_database.py`       |

### Notebook walkthrough (untuk live coding)

Selain script per-langkah, ada juga **notebook** yang merangkai semua materi dalam
satu alur cerita — enak untuk dijelaskan sel-per-sel di depan kelas:

```bash
uv sync --extra notebook                 # install JupyterLab + ipykernel
uv run jupyter lab                        # buka, lalu pilih notebook di folder notebooks/
```

Notebook yang tersedia:

- [`notebooks/walkthrough.ipynb`](notebooks/walkthrough.ipynb) — walkthrough seluruh pipeline (semua langkah dalam satu alur).
- [`notebooks/beautifulsoup_vs_xpath.ipynb`](notebooks/beautifulsoup_vs_xpath.ipynb) — fokus **cara memilih elemen** (tag, class, id, atribut `aria`/`href`/`data-*`, teks, navigasi) dari mudah ke kompleks, tiap case dibandingkan **BeautifulSoup vs XPath**.

**`notebooks/cases/` — kasus-kasus "susah" (satu notebook per kasus):**

- [`cases/01_pagination.ipynb`](notebooks/cases/01_pagination.ipynb) — pagination kompleks (ikuti tombol Next sampai habis; requests vs Selenium).
- [`cases/02_infinite_scroll.ipynb`](notebooks/cases/02_infinite_scroll.ipynb) — lazy-load / infinite scroll (hidden API vs Selenium scroll).
- [`cases/03_webdriverwait.ipynb`](notebooks/cases/03_webdriverwait.ipynb) — `WebDriverWait` + `expected_conditions` (menunggu elemen dengan benar).
- [`cases/04_tables.ipynb`](notebooks/cases/04_tables.ipynb) — tabel HTML pakai `pandas.read_html` (one-liner).

**`notebooks/misc/` — library bantu:**

- [`misc/newspaper3k.ipynb`](notebooks/misc/newspaper3k.ipynb) — parsing artikel berita otomatis (multi-source) dengan `newspaper4k`. Butuh `uv sync --extra news`.
- [`misc/ecommerce_scraping.ipynb`](notebooks/misc/ecommerce_scraping.ipynb) — toolkit e-commerce: `extruct` (JSON-LD, contoh berhasil & gagal), `price-parser`, **robots.txt** (scraping baik vs buruk), dan **Scrapy** (async — bandingkan waktu `CONCURRENT_REQUESTS` 1 vs 16) + pola `scrapy-poet`/`zyte`. Butuh `uv sync --extra ecommerce`.
- [`misc/scrapy_real_case.ipynb`](notebooks/misc/scrapy_real_case.ipynb) — **lab keamanan anti-bot (red vs blue)** pada e-commerce nyata: recon (`robots.txt` via Protego, deteksi SPA + Cloudflare), **tangga eskalasi bypass** (UA → header → sidik jari TLS/JA3 `curl_cffi` → warm-up cookie) yang **benar-benar menembus** API, dikemas jadi **spider Scrapy** (`scrapy-impersonate`) → `pandas`, **plus cara mendeteksi & mencegah tiap teknik**. Untuk edukasi pertahanan. Butuh `uv sync --extra security`.

### Pipeline lengkap (end-to-end)

```bash
uv run python pipeline.py            # default 3 halaman
uv run python pipeline.py --halaman 5
```

Hasilnya tersimpan di `data/produk.csv` dan `data/ecommerce.db` (SQLite).

Cek isi database SQLite:

```bash
uv run python -c "import sqlite3; print(sqlite3.connect('data/ecommerce.db').execute('SELECT * FROM produk LIMIT 5').fetchall())"
```

---

## Struktur Project

```
dibimbing_scraping/
├── README.md
├── pyproject.toml              # dependency (dikelola uv)
├── .python-version             # Python 3.12
├── pipeline.py                 # pipeline lengkap (extract -> transform -> load)
├── notebooks/
│   ├── walkthrough.ipynb            # walkthrough semua langkah dalam 1 notebook
│   ├── beautifulsoup_vs_xpath.ipynb # cara memilih elemen: BS4 vs XPath (mudah->kompleks)
│   ├── cases/                       # kasus-kasus "susah" (1 notebook per kasus)
│   │   ├── 01_pagination.ipynb
│   │   ├── 02_infinite_scroll.ipynb
│   │   ├── 03_webdriverwait.ipynb
│   │   └── 04_tables.ipynb
│   └── misc/
│       ├── newspaper3k.ipynb        # parsing artikel berita (newspaper4k)
│       ├── ecommerce_scraping.ipynb # extruct + price-parser + robots.txt + Scrapy (async)
│       └── scrapy_real_case.ipynb   # lab keamanan anti-bot (red/blue) + spider Scrapy nyata
├── steps/                      # materi step-by-step
│   ├── 01_pipeline_overview.py
│   ├── 02_bs4_satu_item.py
│   ├── 03_bs4_satu_halaman.py
│   ├── 04_bs4_banyak_halaman.py
│   ├── 05_selenium_dinamis.py
│   ├── 06_selenium_xpath.py
│   ├── 07_api.py
│   ├── 08_cleaning.py
│   └── 09_simpan_database.py
└── data/                       # output CSV & database (otomatis dibuat)
```
