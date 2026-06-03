"""
Step 1 - Understanding the Data Pipeline
========================================

Goal: Understand the basic pipeline flow in a data engineering project.

A data pipeline is an AUTOMATED flow for moving data from a SOURCE to a
DESTINATION, through a process that is STRUCTURED and REPEATABLE.

In this project, the pipeline follows the flow shown below.
Run this file to see an overview of that flow:

    uv run python steps/01_pipeline_overview.py
"""

PIPELINE_STAGES = [
    "Scrape 1 item",
    "Scrape 1 page",
    "Build a Dictionary List",
    "Scrape Several Pages",
    "Clean the Data",
    "Open a Database Connection",
    "Create the Table and Insert Data",
]


def show_pipeline() -> None:
    print("=" * 50)
    print("PROJECT FLOW: Web Scraping & API Integration")
    print("=" * 50)
    for i, stage in enumerate(PIPELINE_STAGES, start=1):
        print(f"  [{i}] {stage}")
        if i < len(PIPELINE_STAGES):
            print("        |")
            print("        v")
    print("=" * 50)
    print("Data sources used in this class:")
    print("  - Static  (BeautifulSoup) : https://books.toscrape.com")
    print("  - Dynamic (Selenium)      : https://quotes.toscrape.com/js")
    print("  - API                     : https://dummyjson.com/products")
    print("=" * 50)


if __name__ == "__main__":
    show_pipeline()
