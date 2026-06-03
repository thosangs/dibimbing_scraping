<p align="center">
  <img src="docs/assets/banner.svg" alt="Building Scalable Data Pipelines" width="100%" />
</p>

<h1 align="center">Building Scalable Data Pipelines</h1>

<p align="center">
  <b>Hands-on Data Engineering</b><br/>
  Web Scraping (BeautifulSoup + Selenium + XPath) & API Integration for E-Commerce
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
  <a href="#running-each-step"><b>🪜 Step-by-Step Material</b></a> ·
  <a href="#setup-using-uv"><b>🚀 Quickstart</b></a>
</p>

---

This project is organized **step-by-step** following the class slides/guidelines. Each step
is a single, self-contained file you can run on its own, which makes it ideal for teaching
while _live coding_.

---

## Pipeline Flow

```
Scrape 1 item -> Scrape 1 page -> Build Dictionary List -> Scrape Multiple Pages
   -> Clean Data -> Create Database Connection -> Create Table & Insert Data
```

## Data Sources

| Technique              | Website                              | Notes                         |
| ---------------------- | ------------------------------------ | ----------------------------- |
| BeautifulSoup (static) | https://books.toscrape.com           | Bookstore (scraping sandbox)  |
| Selenium (dynamic)     | https://quotes.toscrape.com/js       | Content rendered by JavaScript |
| API                    | https://dummyjson.com/products       | Public e-commerce API         |
| XPath playground       | https://scrapinghub.github.io/xpath-playground/ | XPath practice     |

---

## Setup (using UV)

> This project uses **[uv](https://docs.astral.sh/uv/)** as its package & environment manager.
> uv automatically provisions Python 3.12 and all libraries, with no manual `venv` hassle.

### 1. Install uv (if you don't have it yet)

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 2. Install all dependencies

```bash
uv sync
```

That's it. uv creates a virtual environment in `.venv/` and installs
`requests`, `beautifulsoup4`, `lxml`, `selenium`, and `pandas`.

### 3. (Optional) For PostgreSQL

```bash
uv sync --extra postgres
```

---

## Selenium Setup

### 1. Install a browser (Chrome/Chromium)

Selenium needs a real browser. Make sure **Google Chrome** or **Chromium**
is already installed on your machine. If you already use Chrome regularly,
there's nothing else to install.

### 2. The driver does NOT need to be installed manually

Selenium >= 4.6 ships with **Selenium Manager**, which automatically downloads
the ChromeDriver/GeckoDriver that matches your browser version. So there's no
manual ChromeDriver install step — that's why we use this setup, to keep things
easy.

> By default the browser is **visible** when it runs, so we can watch the
> automation during a demo. If you want it to run without opening a browser
> window, call `buat_driver(headless=True)` inside the Selenium script.

---

## Running Each Step

Run them with `uv run` (uv automatically uses the correct environment):

| Step | Material                                | Command                                           |
| ---- | --------------------------------------- | ------------------------------------------------- |
| 1    | Understanding the Data Pipeline         | `uv run python steps/01_pipeline_overview.py`     |
| 2    | BeautifulSoup - scrape 1 item           | `uv run python steps/02_bs4_satu_item.py`         |
| 3    | BeautifulSoup - 1 page (dict list)      | `uv run python steps/03_bs4_satu_halaman.py`      |
| 4    | BeautifulSoup - multiple pages          | `uv run python steps/04_bs4_banyak_halaman.py`    |
| 5    | Selenium - dynamic website              | `uv run python steps/05_selenium_dinamis.py`      |
| 6    | Selenium - XPath                        | `uv run python steps/06_selenium_xpath.py`        |
| 7    | API                                     | `uv run python steps/07_api.py`                   |
| 8    | Cleaning data (pandas)                  | `uv run python steps/08_cleaning.py`              |
| 9    | Save to database (SQLite/Postgres)      | `uv run python steps/09_simpan_database.py`       |

### Notebook walkthrough (for live coding)

In addition to the per-step scripts, there's also a **notebook** that ties all the
material together into one storyline — great for explaining cell by cell in front of
a class:

```bash
uv sync --extra notebook                 # install JupyterLab + ipykernel
uv run jupyter lab                        # open it, then pick a notebook in the notebooks/ folder
```

Available notebooks:

- [`notebooks/walkthrough.ipynb`](notebooks/walkthrough.ipynb) — a walkthrough of the entire pipeline (all steps in one flow).
- [`notebooks/beautifulsoup_vs_xpath.ipynb`](notebooks/beautifulsoup_vs_xpath.ipynb) — focused on **how to select elements** (tag, class, id, `aria`/`href`/`data-*` attributes, text, navigation) from easy to complex, with each case compared **BeautifulSoup vs XPath**.

**`notebooks/cases/` — the "hard" cases (one notebook per case):**

- [`cases/01_pagination.ipynb`](notebooks/cases/01_pagination.ipynb) — complex pagination (follow the Next button until it runs out; requests vs Selenium).
- [`cases/02_infinite_scroll.ipynb`](notebooks/cases/02_infinite_scroll.ipynb) — lazy-load / infinite scroll (hidden API vs Selenium scroll).
- [`cases/03_webdriverwait.ipynb`](notebooks/cases/03_webdriverwait.ipynb) — `WebDriverWait` + `expected_conditions` (waiting for elements correctly).
- [`cases/04_tables.ipynb`](notebooks/cases/04_tables.ipynb) — HTML tables using `pandas.read_html` (a one-liner).

**`notebooks/misc/` — helper libraries:**

- [`misc/newspaper3k.ipynb`](notebooks/misc/newspaper3k.ipynb) — automatic news article parsing (multi-source) with `newspaper4k`. Requires `uv sync --extra news`.
- [`misc/ecommerce_scraping.ipynb`](notebooks/misc/ecommerce_scraping.ipynb) — an e-commerce toolkit: `extruct` (JSON-LD, with successful & failing examples), `price-parser`, **robots.txt** (good vs bad scraping), and **Scrapy** (async — compare timing for `CONCURRENT_REQUESTS` 1 vs 16) plus the `scrapy-poet`/`zyte` pattern. Requires `uv sync --extra ecommerce`.
- [`misc/scrapy_real_case.ipynb`](notebooks/misc/scrapy_real_case.ipynb) — an **anti-bot security lab (red vs blue)** on a real e-commerce site: recon (`robots.txt` via Protego, SPA + Cloudflare detection), an **escalation ladder of bypasses** (UA → headers → TLS/JA3 fingerprint with `curl_cffi` → cookie warm-up) that **actually breaks through** the API, packaged into a **Scrapy spider** (`scrapy-impersonate`) → `pandas`, **plus how to detect & prevent each technique**. For defensive education. Requires `uv sync --extra security`.

### Full pipeline (end-to-end)

```bash
uv run python pipeline.py            # defaults to 3 pages
uv run python pipeline.py --pages 5
```

The results are saved to `data/products.csv` and `data/ecommerce.db` (SQLite).

Inspect the SQLite database contents:

```bash
uv run python -c "import sqlite3; print(sqlite3.connect('data/ecommerce.db').execute('SELECT * FROM products LIMIT 5').fetchall())"
```

---

## Project Structure

```
dibimbing_scraping/
├── README.md
├── pyproject.toml              # dependencies (managed by uv)
├── .python-version             # Python 3.12
├── pipeline.py                 # full pipeline (extract -> transform -> load)
├── notebooks/
│   ├── walkthrough.ipynb            # walkthrough of all steps in 1 notebook
│   ├── beautifulsoup_vs_xpath.ipynb # how to select elements: BS4 vs XPath (easy->complex)
│   ├── cases/                       # the "hard" cases (1 notebook per case)
│   │   ├── 01_pagination.ipynb
│   │   ├── 02_infinite_scroll.ipynb
│   │   ├── 03_webdriverwait.ipynb
│   │   └── 04_tables.ipynb
│   └── misc/
│       ├── newspaper3k.ipynb        # news article parsing (newspaper4k)
│       ├── ecommerce_scraping.ipynb # extruct + price-parser + robots.txt + Scrapy (async)
│       └── scrapy_real_case.ipynb   # anti-bot security lab (red/blue) + real Scrapy spider
├── steps/                      # step-by-step material
│   ├── 01_pipeline_overview.py
│   ├── 02_bs4_satu_item.py
│   ├── 03_bs4_satu_halaman.py
│   ├── 04_bs4_banyak_halaman.py
│   ├── 05_selenium_dinamis.py
│   ├── 06_selenium_xpath.py
│   ├── 07_api.py
│   ├── 08_cleaning.py
│   └── 09_simpan_database.py
└── data/                       # CSV & database output (created automatically)
```
