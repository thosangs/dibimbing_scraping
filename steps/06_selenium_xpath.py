"""
Step 6 - Using XPath to Select Elements
=======================================

Goal: Understand how to select HTML elements using XPath in Selenium.

XPath (XML Path Language) is a query language for navigating and selecting
nodes/elements within an HTML/XML document (the DOM).

XPath examples (try them at https://scrapinghub.github.io/xpath-playground/):
    //h1                              -> all <h1> tags
    //p                               -> all <p> tags
    //p[1]                            -> the first <p> tag
    //*[@id="first-name"]             -> any element with id="first-name"
    //p[@class="plot"]                -> <p> with class="plot" (exact match)
    //p[contains(@class,"plot")]      -> <p> whose class CONTAINS "plot"

Here we use XPath to extract quotes from a dynamic website, as an
alternative to By.CLASS_NAME from Step 5.

Run:
    uv run python steps/06_selenium_xpath.py
"""

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

URL = "https://quotes.toscrape.com/js/"


def build_driver(headless: bool = False) -> webdriver.Chrome:
    options = Options()
    if headless:
        # run without a browser window (optional)
        options.add_argument("--headless=new")
    options.add_argument("--window-size=1920,1080")
    # Selenium Manager automatically sets up a matching driver
    return webdriver.Chrome(options=options)


def main() -> None:
    driver = build_driver()
    try:
        driver.get(URL)

        # XPath: get all <div class="quote">
        quotes = driver.find_elements(By.XPATH, '//div[@class="quote"]')
        print(f"=== Fetched {len(quotes)} quotes using XPath ===")

        for q in quotes[:5]:
            # Relative XPath (starts with ".") -> searched WITHIN this quote element
            text = q.find_element(By.XPATH, './/span[@class="text"]').text
            author = q.find_element(By.XPATH, './/small[@class="author"]').text
            print(f"- {text}  -- {author}")

        # Another XPath example: get the page title <h1> directly
        title = driver.find_element(By.XPATH, "//h1").text
        print("\nPage title (//h1):", title)
    finally:
        driver.quit()


if __name__ == "__main__":
    main()
