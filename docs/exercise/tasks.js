// Practice tasks. Each task's `ref` is a reference matcher the grader runs to get
// the expected set of nodes. A student's answer is correct when their selector
// (CSS or XPath) matches exactly the same nodes — so multiple valid answers pass.
window.EXERCISE_DATA = {
  books: {
    label: "Bookstore catalogue",
    file: "pages/books.html",
    blurb: "A product listing styled after a classic scraping-practice bookstore.",
    tasks: [
      {
        id: "all-cards",
        prompt: "Pilih semua kartu produk (tiap buku).",
        hint: "Tiap buku dibungkus <article class=\"product_pod\">.",
        ref: { engine: "css", expr: "article.product_pod" },
      },
      {
        id: "all-prices",
        prompt: "Pilih semua elemen harga (£…).",
        hint: "Harga ada di <p class=\"price_color\">.",
        ref: { engine: "css", expr: ".price_color" },
      },
      {
        id: "second-title",
        prompt: "Pilih link judul buku ke-2 saja.",
        hint: "Pakai :nth-child(2) pada <li>, lalu turun ke h3 > a. Di XPath: (//h3/a)[2].",
        ref: { engine: "css", expr: "ol.row > li:nth-child(2) h3 a" },
      },
      {
        id: "out-of-stock",
        prompt: "Pilih elemen ketersediaan untuk buku yang Out of stock.",
        hint: "class-nya \"outofstock availability\". Match token kelas, bukan substring.",
        ref: { engine: "css", expr: ".availability.outofstock" },
      },
      {
        id: "next-link",
        prompt: "Pilih link \"next\" di pagination.",
        hint: "Ada di <li class=\"next\"> di dalam <nav class=\"pager\">.",
        ref: { engine: "css", expr: ".pager .next a" },
      },
      {
        id: "rating-three",
        prompt: "Pilih kartu <article> untuk buku yang ratingnya 3 bintang.",
        hint: "Rating ada di <p class=\"star-rating Three\">. Naik ke <article> leluhurnya — ini kasus XPath: //article[.//p[contains(concat(' ',normalize-space(@class),' '),' Three ')]]",
        ref: { engine: "xpath", expr: "//article[.//p[contains(concat(' ', normalize-space(@class), ' '), ' Three ')]]" },
      },
    ],
  },

  quotes: {
    label: "Quotes page",
    file: "pages/quotes.html",
    blurb: "Nested quotes with authors and tags — great for descendant & attribute selectors.",
    tasks: [
      {
        id: "all-quotes",
        prompt: "Pilih semua blok quote.",
        hint: "Tiap quote ada di <div class=\"quote\">.",
        ref: { engine: "css", expr: ".quote" },
      },
      {
        id: "all-text",
        prompt: "Pilih semua teks quote-nya.",
        hint: "Teks ada di <span class=\"text\"> di dalam .quote.",
        ref: { engine: "css", expr: ".quote .text" },
      },
      {
        id: "all-authors",
        prompt: "Pilih semua nama author.",
        hint: "Nama author di <span class=\"author\">.",
        ref: { engine: "css", expr: ".quote .author" },
      },
      {
        id: "first-quote-tags",
        prompt: "Pilih semua tag link di quote PERTAMA.",
        hint: "Pakai :first-child pada .quote, lalu .tags a.tag.",
        ref: { engine: "css", expr: "#quotes .quote:first-child .tags a.tag" },
      },
      {
        id: "einstein-quotes",
        prompt: "Pilih semua quote oleh Albert Einstein (lewat atribut).",
        hint: "Tiap .quote punya data-author. Selector atribut: .quote[data-author=\"Albert Einstein\"].",
        ref: { engine: "css", expr: ".quote[data-author=\"Albert Einstein\"]" },
      },
      {
        id: "tag-inspirational",
        prompt: "Pilih div.quote yang punya tag \"inspirational\".",
        hint: "Butuh predikat berdasar teks anak — XPath: //div[contains(concat(' ',normalize-space(@class),' '),' quote ')][.//a[@class='tag' and normalize-space()='inspirational']]",
        ref: { engine: "xpath", expr: "//div[contains(concat(' ', normalize-space(@class), ' '), ' quote ')][.//a[@class='tag' and normalize-space()='inspirational']]" },
      },
    ],
  },

  product: {
    label: "Product page",
    file: "pages/product.html",
    blurb: "An e-commerce product detail with JSON-LD, data-* attributes and a spec <table>.",
    tasks: [
      {
        id: "title",
        prompt: "Pilih judul produk.",
        hint: "Judul ada di <h1 class=\"product-title\">.",
        ref: { engine: "css", expr: "h1.product-title" },
      },
      {
        id: "main-price",
        prompt: "Pilih HARGA UTAMA produk (bukan harga produk terkait).",
        hint: "Harga utama ada di dalam .info; produk terkait ada di ul.related. Scope-kan: .info .price.",
        ref: { engine: "css", expr: ".info > .price" },
      },
      {
        id: "spec-rows",
        prompt: "Pilih semua baris (<tr>) di tabel spesifikasi.",
        hint: "AWAS: browser menyisipkan <tbody>! //table/tr akan KOSONG. Pakai descendant: table.specs tr  atau  //table[@class='specs']//tr.",
        ref: { engine: "css", expr: "table.specs tr" },
      },
      {
        id: "related",
        prompt: "Pilih semua item produk terkait.",
        hint: "Tiap item: <li data-sku=\"…\"> di dalam ul.related.",
        ref: { engine: "css", expr: "ul.related li[data-sku]" },
      },
      {
        id: "variant-td",
        prompt: "Pilih sel tabel yang punya atribut data-variant.",
        hint: "Selector atribut pada <td>. XPath: //td[@data-variant].",
        ref: { engine: "css", expr: "td[data-variant]" },
      },
      {
        id: "berat-value",
        prompt: "Pilih sel NILAI untuk baris \"Berat\".",
        hint: "Cari <tr> yang <th>-nya \"Berat\", lalu ambil <td>-nya — XPath: //table[contains(@class,'specs')]//tr[th[normalize-space()='Berat']]/td",
        ref: { engine: "xpath", expr: "//table[contains(@class,'specs')]//tr[th[normalize-space()='Berat']]/td" },
      },
    ],
  },
};
