// Guided lessons — 30 total: 10 Easy · 10 Medium · 10 Hard
// Each lesson is tagged engine:'css' or engine:'xpath' so students can filter.
// Inline markdown in text fields: **bold**, `code`, *italic*. Paragraphs split on \n\n.
window.EXERCISE_LESSONS = [

  // ═══════════════════ EASY ═══════════════════

  {
    id: "e-css-1", level: "Easy", engine: "css",
    title: "CSS — Pilih berdasarkan class",
    html:
`<h1>Toko Gadget</h1>
<div class="product">
  <h3 class="title">USB-C Cable</h3>
  <span class="price">Rp 45.000</span>
</div>
<div class="product">
  <h3 class="title">Power Bank 10000mAh</h3>
  <span class="price">Rp 189.000</span>
</div>
<div class="product">
  <h3 class="title">Wireless Mouse</h3>
  <span class="price">Rp 120.000</span>
</div>`,
    intro:
`Selector paling dasar di CSS: **class**. Titik (\`.\`) berarti "elemen ber-class ini".

\`.price\` → cocokkan *semua* elemen yang punya \`class="price"\`, tak peduli tag-nya apa.`,
    goal: "Pilih semua elemen harga.",
    answer: { engine: "css", expr: ".price" },
    why: "`.price` memilih ketiga `<span class=\"price\">`. Setara `soup.select('.price')` atau `soup.find_all(class_='price')` di BeautifulSoup.",
    tip: "Tag + class bisa digabung: `span.price` — hanya `<span>` yang ber-class `price`.",
  },

  {
    id: "e-css-2", level: "Easy", engine: "css",
    title: "CSS — Pilih berdasarkan id",
    html:
`<nav id="topbar">Menu</nav>
<section id="featured">
  <h3>Promo Hari Ini</h3>
  <span class="price">Rp 9.900</span>
</section>
<section id="catalog">
  <h3>Katalog</h3>
</section>`,
    intro:
`Tanda pagar (\`#\`) memilih berdasarkan **id**. Id seharusnya **unik** dalam satu halaman — cocok untuk menarget satu blok spesifik.`,
    goal: "Pilih section dengan id \"featured\".",
    answer: { engine: "css", expr: "#featured" },
    why: "`#featured` menarget elemen ber-id `featured`. XPath setara: `//*[@id='featured']`.",
    tip: "Karena id unik, `soup.select_one('#featured')` langsung mengembalikan satu elemen.",
  },

  {
    id: "e-css-3", level: "Easy", engine: "css",
    title: "CSS — Selector atribut (href^=)",
    html:
`<ul>
  <li><a href="/p/usb-c">USB-C Cable</a></li>
  <li><a href="/category/audio">Audio</a></li>
  <li><a href="/p/powerbank">Power Bank</a></li>
  <li><a href="https://partner.example.com">Partner</a></li>
</ul>`,
    intro:
`Selector atribut memberi kita akses ke nilai atribut apapun:

- \`[href]\` — punya atribut href
- \`[href^="/p/"]\` — href **diawali** \`/p/\`
- \`[href$=".pdf"]\` — href **diakhiri** \`.pdf\`
- \`[href*="sale"]\` — href **mengandung** \`sale\``,
    goal: "Pilih hanya link produk (href diawali /p/).",
    answer: { engine: "css", expr: 'a[href^="/p/"]' },
    why: '`a[href^="/p/"]` memilih 2 link produk, mengabaikan kategori & link eksternal.',
    tip: "Atribut `data-*` sering paling stabil untuk scraping: `[data-sku]`, `[data-testid=\"price\"]`.",
  },

  {
    id: "e-css-4", level: "Easy", engine: "css",
    title: "CSS — Gabungkan tag + class",
    html:
`<p class="note">Catatan umum</p>
<span class="note">Harga belum termasuk PPN</span>
<div class="note">Info pengiriman</div>`,
    intro:
`Tag dan class bisa **digabung langsung** (tanpa spasi): \`tag.class\`.

- \`span.note\` → hanya elemen \`<span>\` yang punya class \`note\`
- \`.note\` → semua elemen ber-class \`note\`, apapun tag-nya`,
    goal: "Pilih hanya elemen <span> yang ber-class \"note\".",
    answer: { engine: "css", expr: "span.note" },
    why: "`span.note` hanya cocok dengan `<span class=\"note\">`. Dua elemen lain (`<p>`, `<div>`) tidak terpilih meski ber-class sama.",
    tip: "Ini sangat berguna saat class yang sama dipakai di berbagai tag dan kamu hanya mau tag tertentu.",
  },

  {
    id: "e-css-5", level: "Easy", engine: "css",
    title: "CSS — Beberapa selector sekaligus (koma)",
    html:
`<article>
  <h2>Judul Artikel</h2>
  <h3>Sub-judul</h3>
  <p>Isi artikel...</p>
  <footer>Penulis: Tim Redaksi</footer>
</article>`,
    intro:
`**Koma** menggabungkan beberapa selector — artinya "pilih ini *atau* itu".

\`h2, h3\` → pilih semua \`<h2>\` dan semua \`<h3>\`.`,
    goal: "Pilih semua heading (h2 dan h3) sekaligus.",
    answer: { engine: "css", expr: "h2, h3" },
    why: "`h2, h3` mengembalikan dua elemen sekaligus. Di BeautifulSoup: `soup.select('h2, h3')`.",
    tip: "Bisa digabung berapa saja: `h1, h2, h3, h4` — berguna untuk mengambil semua judul di artikel.",
  },

  // ---- Easy XPath (5) ----

  {
    id: "e-xpath-1", level: "Easy", engine: "xpath",
    title: "XPath — Memilih semua elemen bertag tertentu",
    html:
`<div class="catalog">
  <h3>Sepeda Gunung</h3>
  <p>Cocok untuk medan berat</p>
  <h3>Sepeda Lipat</h3>
  <p>Praktis dibawa ke mana-mana</p>
  <h3>Sepeda Balap</h3>
  <p>Untuk kecepatan tinggi</p>
</div>`,
    intro:
`XPath menggunakan sintaks mirip path file. Dua garis miring (\`//\`) berarti "cari di mana saja dalam dokumen".

\`//h3\` → ambil **semua** elemen \`<h3>\` di halaman, di kedalaman berapa pun.`,
    goal: "Pilih semua heading h3.",
    answer: { engine: "xpath", expr: "//h3" },
    why: "`//h3` mengembalikan ketiga `<h3>`. Di Python/lxml: `tree.xpath('//h3')`.",
    tip: "Satu garis miring (`/html/body/div/h3`) adalah *path absolut* — rapuh karena bergantung pada struktur. Selalu pakai `//` untuk mencari relatif.",
  },

  {
    id: "e-xpath-2", level: "Easy", engine: "xpath",
    title: "XPath — Filter berdasarkan atribut ([@attr='val'])",
    html:
`<ul>
  <li data-status="available">USB-C Cable</li>
  <li data-status="sold-out">Headset Bluetooth</li>
  <li data-status="available">Power Bank</li>
  <li data-status="sold-out">Webcam HD</li>
</ul>`,
    intro:
`Tanda kurung siku (\`[]\`) adalah **predikat** — kondisi penyaring. \`[@attr='val']\` artinya "hanya elemen yang atribut \`attr\`-nya persis \`val\`".

\`//li[@data-status='available']\` → hanya item yang tersedia.`,
    goal: "Pilih hanya li yang data-status-nya \"available\".",
    answer: { engine: "xpath", expr: "//li[@data-status='available']" },
    why: "`//li[@data-status='available']` mengembalikan dua elemen (USB-C Cable & Power Bank).",
    tip: "Untuk atribut *ada* (tak peduli nilainya), pakai hanya `[@data-status]` tanpa `='...'`.",
  },

  {
    id: "e-xpath-3", level: "Easy", engine: "xpath",
    title: "XPath — Mencocokkan teks (text())",
    html:
`<div class="badges">
  <span class="tag">New</span>
  <span class="tag">Sale</span>
  <span class="tag">Hot</span>
  <span class="tag">Limited</span>
</div>`,
    intro:
`CSS tidak bisa memilih berdasarkan teks. XPath bisa, lewat \`text()\`.

\`//span[text()='Sale']\` → pilih \`<span>\` yang teksnya persis "Sale".

\`normalize-space()\` membersihkan whitespace ekstra (newline, spasi ganda) sebelum dibandingkan — lebih aman.`,
    goal: "Pilih tag yang teksnya tepat \"Sale\".",
    answer: { engine: "xpath", expr: "//span[normalize-space()='Sale']" },
    why: "`normalize-space()` merapikan spasi. `text()='Sale'` juga bisa, tapi lebih rapuh jika ada whitespace tersembunyi.",
    tip: "Untuk pencocokan *sebagian* teks, pakai `contains(., 'Sale')` (titik = node saat ini).",
  },

  {
    id: "e-xpath-4", level: "Easy", engine: "xpath",
    title: "XPath — Pilih berdasarkan posisi ([N])",
    html:
`<ol class="steps">
  <li>Buka terminal</li>
  <li>Install dependensi</li>
  <li>Jalankan scraper</li>
  <li>Cek hasil di database</li>
</ol>`,
    intro:
`XPath mengindeks elemen mulai dari **1** (bukan 0 seperti Python).

- \`(//li)[2]\` → li kedua
- \`(//li)[last()]\` → li terakhir
- \`(//li)[last()-1]\` → li kedua dari akhir

Catatan: tanda kurung di luar **penting** — \`//li[2]\` artinya "li yang merupakan anak ke-2 dari parentnya", beda maknanya jika ada banyak parent.`,
    goal: "Pilih item langkah ke-3.",
    answer: { engine: "xpath", expr: "(//li)[3]" },
    why: "`(//li)[3]` mengambil elemen `<li>` ketiga dari seluruh dokumen.",
    tip: "Bingung `(//li)[2]` vs `//li[2]`? Pakai `(//li)[2]` untuk \"li ke-2 dari semua li\" dan `//ol/li[2]` untuk \"li ke-2 dalam ol tertentu\".",
  },

  {
    id: "e-xpath-5", level: "Easy", engine: "xpath",
    title: "XPath — Cek keberadaan atribut ([@attr])",
    html:
`<div class="form">
  <input type="text" name="email" required placeholder="Email kamu">
  <input type="text" name="username" placeholder="Username">
  <input type="password" name="password" required>
  <input type="submit" value="Daftar">
</div>`,
    intro:
`Tidak semua elemen punya atribut yang sama. \`[@required]\` (tanpa \`=\`) memilih elemen yang atribut \`required\`-nya **ada**, berapapun nilainya.

CSS setara: \`[required]\` (sama sintaksnya).`,
    goal: "Pilih semua input yang punya atribut \"required\".",
    answer: { engine: "xpath", expr: "//input[@required]" },
    why: "`//input[@required]` mengembalikan dua input (email & password). Submit tidak punya `required`, jadi tidak ikut.",
    tip: "Bisa digabung: `//input[@required and @name]` — input yang wajib diisi DAN punya atribut name.",
  },

  // ═══════════════════ MEDIUM ═══════════════════

  {
    id: "m-css-1", level: "Medium", engine: "css",
    title: "CSS — Descendant vs direct child (>)",
    html:
`<div class="card">
  <h3 class="title">Judul Utama</h3>
  <div class="meta">
    <span class="title">Penulis: Budi</span>
  </div>
</div>`,
    intro:
`Kombinator menentuakn **hubungan** antar elemen:

- **Spasi** = *descendant* — semua turunan, kedalaman berapa pun. \`.card .title\` → 2 elemen.
- **\`>\`** = *direct child* — hanya anak **langsung**. \`.card > .title\` → 1 elemen.`,
    goal: "Pilih HANYA .title yang anak langsung dari .card.",
    answer: { engine: "css", expr: ".card > .title" },
    why: "`.card > .title` cocok hanya dengan `<h3>` yang anak langsung `.card`. `<span class=\"title\">` di dalam `.meta` tidak ikut.",
    tip: "Selalu pilih kombinator sesempit mungkin — descendant (spasi) sering kepilih elemen tak terduga.",
  },

  {
    id: "m-css-2", level: "Medium", engine: "css",
    title: "CSS — Posisi: :nth-child & :nth-of-type",
    html:
`<table class="data">
  <tr><th>Nama</th><th>Harga</th><th>Stok</th></tr>
  <tr><td>Kopi Arabika</td><td>Rp 50.000</td><td>120</td></tr>
  <tr><td>Teh Hijau</td><td>Rp 35.000</td><td>80</td></tr>
  <tr><td>Susu Almond</td><td>Rp 45.000</td><td>60</td></tr>
</table>`,
    intro:
`- \`:nth-child(n)\` — berdasarkan urutan di antara *semua* sibling
- \`:nth-of-type(n)\` — berdasarkan urutan di antara sibling *dengan tag yang sama*
- Formula: \`2n\` = genap, \`2n+1\` = ganjil, \`odd\` / \`even\` sebagai alias`,
    goal: "Pilih semua baris data (tr ke-2, ke-3, ke-4 — bukan header).",
    answer: { engine: "css", expr: "tr:nth-child(n+2)" },
    why: "`tr:nth-child(n+2)` artinya 'tr yang posisinya ≥ 2', sehingga header (posisi 1) tidak ikut.",
    tip: "Alternatif: `tr:not(:first-child)` — lebih ekspresif. Atau `tbody tr` jika tabel punya `<tbody>`.",
  },

  {
    id: "m-css-3", level: "Medium", engine: "css",
    title: "CSS — Negasi: :not()",
    html:
`<ul class="menu">
  <li>Beranda</li>
  <li class="disabled">Profil (premium)</li>
  <li>Produk</li>
  <li class="disabled">Laporan (premium)</li>
  <li>Tentang</li>
</ul>`,
    intro:
`\`:not(selector)\` memilih elemen yang **tidak** cocok dengan selector di dalam kurung.

\`li:not(.disabled)\` → semua \`<li>\` yang TIDAK punya class \`disabled\`.`,
    goal: "Pilih semua item menu yang tidak disabled.",
    answer: { engine: "css", expr: "li:not(.disabled)" },
    why: "`li:not(.disabled)` mengembalikan tiga item aktif. XPath setara: `//li[not(@class='disabled')]`.",
    tip: "`:not()` modern bisa menerima selector kompleks: `:not(.disabled, .hidden)`.",
  },

  {
    id: "m-css-4", level: "Medium", engine: "css",
    title: "CSS — Atribut mengandung (*=) dan diawali (^=)",
    html:
`<div class="product-card">Produk A</div>
<div class="product-list">Produk B</div>
<div class="featured-product">Produk C</div>
<div class="sidebar">Iklan</div>`,
    intro:
`Variasi selector atribut untuk pencocokan fleksibel:

- \`[class*="product"]\` — class **mengandung** kata "product"
- \`[class^="product"]\` — class **diawali** "product"
- \`[class$="product"]\` — class **diakhiri** "product"`,
    goal: "Pilih semua div yang class-nya MENGANDUNG kata \"product\" (di posisi mana pun).",
    answer: { engine: "css", expr: 'div[class*="product"]' },
    why: "`div[class*=\"product\"]` cocok dengan tiga elemen pertama. `featured-product` ikut karena *mengandung* kata \"product\".",
    tip: "Hati-hati dengan `*=` — juga cocok dengan `product-info`, `product-image`, dll. Jika butuh kata utuh, XPath dengan `contains(concat(...),' product ')` lebih presisi.",
  },

  {
    id: "m-css-5", level: "Medium", engine: "css",
    title: "CSS — Sibling: adjacent (+) dan general (~)",
    html:
`<h3>Tips Scraping</h3>
<p>Selalu hormati robots.txt.</p>
<p>Batasi kecepatan request.</p>
<blockquote>Scraping etis itu penting.</blockquote>
<p>Gunakan delay acak.</p>`,
    intro:
`Kombinator sibling bergerak **ke samping** (bukan masuk ke dalam):

- \`h3 + p\` (*adjacent*) — \`<p>\` yang **langsung** setelah \`<h3>\`
- \`h3 ~ p\` (*general*) — **semua** \`<p>\` setelah \`<h3>\` pada level yang sama`,
    goal: "Pilih SEMUA <p> yang muncul setelah <h3> pada level yang sama.",
    answer: { engine: "css", expr: "h3 ~ p" },
    why: "`h3 ~ p` mengembalikan semua tiga `<p>`. Jika pakai `h3 + p`, hanya `<p>` pertama yang kepilih.",
    tip: "`~` melompati sibling yang berbeda tag (seperti `<blockquote>` di tengah). Berguna untuk ambil semua paragraf konten artikel.",
  },

  {
    id: "m-xpath-1", level: "Medium", engine: "xpath",
    title: "XPath — contains() untuk pencocokan sebagian",
    html:
`<div class="product-card featured">Laptop Gaming</div>
<div class="product-card">Mouse Wireless</div>
<div class="product-card new-arrival">SSD External</div>
<div class="sidebar-widget">Iklan</div>`,
    intro:
`\`contains(haystack, needle)\` mencari apakah string mengandung substring.

\`//div[contains(@class, 'product')]\` → elemen yang class-nya mengandung kata 'product'.

Bedanya dengan CSS \`[class*=]\`: XPath lebih ekspresif karena bisa dikombinasi dengan fungsi lain.`,
    goal: "Pilih semua div yang class-nya mengandung \"product\".",
    answer: { engine: "xpath", expr: "//div[contains(@class,'product')]" },
    why: "`contains(@class,'product')` cocok dengan ketiga div ber-class product. Kelemahannya: class `no-product-display` juga akan cocok.",
    tip: "Untuk kata utuh, pakai trik normalize-space: `contains(concat(' ',normalize-space(@class),' '),' product ')`.",
  },

  {
    id: "m-xpath-2", level: "Medium", engine: "xpath",
    title: "XPath — starts-with() dan ends-with()",
    html:
`<ul>
  <li><a href="/p/laptop-asus">Laptop Asus</a></li>
  <li><a href="/category/laptop">Kategori Laptop</a></li>
  <li><a href="/p/mouse-logitech">Mouse Logitech</a></li>
  <li><a href="https://sponsor.com/promo">Promo Sponsor</a></li>
</ul>`,
    intro:
`- \`starts-with(str, prefix)\` — apakah string diawali oleh prefix
- \`ends-with(str, suffix)\` — apakah string diakhiri suffix (XPath 2.0; di XPath 1.0 pakai trik)

Setara CSS: \`[href^="/p/"]\` untuk starts-with.`,
    goal: "Pilih link produk yang href-nya diawali \"/p/\".",
    answer: { engine: "xpath", expr: "//a[starts-with(@href,'/p/')]" },
    why: "`starts-with(@href,'/p/')` mengembalikan dua link produk. Lebih tepat dari `contains` karena hanya cocok di awal.",
    tip: "Untuk ends-with di XPath 1.0: `//a[substring(@href,string-length(@href)-3)='.pdf']` (trik panjang string).",
  },

  {
    id: "m-xpath-3", level: "Medium", engine: "xpath",
    title: "XPath — normalize-space() bersihkan whitespace",
    html:
`<ul class="status-list">
  <li>  In Stock  </li>
  <li>Out of Stock</li>
  <li>
    In Stock
  </li>
  <li>Pre-order</li>
</ul>`,
    intro:
`HTML nyata sering punya whitespace tersembunyi: spasi di ujung, newline, tab. \`text()='In Stock'\` akan **gagal** untuk teks dengan spasi ekstra.

\`normalize-space()\` menghapus leading/trailing whitespace dan mengubah whitespace berulang menjadi satu spasi.`,
    goal: "Pilih semua <li> yang teksnya (setelah normalisasi) adalah \"In Stock\".",
    answer: { engine: "xpath", expr: "//li[normalize-space()='In Stock']" },
    why: "`normalize-space()` cocok dengan `'  In Stock  '` dan `'\\n    In Stock\\n  '`. Tanpanya, hanya teks yang persis `'In Stock'` yang cocok.",
    tip: "Biasakan `normalize-space()` untuk semua pencocokan teks — teks scraped sering kotor.",
  },

  {
    id: "m-xpath-4", level: "Medium", engine: "xpath",
    title: "XPath — following-sibling & preceding-sibling",
    html:
`<table>
  <tr><th>Nama</th><td>AirPods Pro 2</td></tr>
  <tr><th>Harga</th><td>Rp 3.499.000</td></tr>
  <tr><th>Garansi</th><td>12 bulan</td></tr>
  <tr><th>Berat</th><td>61 g</td></tr>
</table>`,
    intro:
`Pada tabel "label : nilai", nilai adalah **saudara** label. Daripada tebak posisi, jangkar ke label:

- \`following-sibling::\` — saudara **setelah** node saat ini
- \`preceding-sibling::\` — saudara **sebelum** node saat ini`,
    goal: "Ambil nilai <td> untuk baris \"Harga\".",
    answer: { engine: "xpath", expr: "//th[normalize-space()='Harga']/following-sibling::td" },
    why: "Jangkar ke `<th>Harga</th>`, lalu ambil `<td>` saudaranya. Tidak perlu tahu posisi baris.",
    tip: "Pola ini tahan-banting: urutan baris bisa berubah, scraper tetap benar karena jangkar ke label.",
  },

  {
    id: "m-xpath-5", level: "Medium", engine: "xpath",
    title: "XPath — last() dan count()",
    html:
`<ol class="breadcrumb">
  <li><a href="/">Beranda</a></li>
  <li><a href="/elektronik">Elektronik</a></li>
  <li><a href="/elektronik/audio">Audio</a></li>
  <li>AirPods Pro</li>
</ol>`,
    intro:
`Fungsi posisi penting di XPath:

- \`last()\` — nomor posisi terakhir dalam konteks saat ini
- \`(//li)[last()]\` → li terakhir
- \`(//li)[last()-1]\` → li kedua dari akhir
- \`count(//li)\` → jumlah total li`,
    goal: "Pilih item breadcrumb terakhir (halaman aktif).",
    answer: { engine: "xpath", expr: "(//li)[last()]" },
    why: "`(//li)[last()]` mengambil `<li>AirPods Pro</li>`. Tanda kurung penting — lihat lesson Easy XPath Posisi.",
    tip: "Untuk breadcrumb scraping, item terakhir biasanya halaman yang sedang dibuka (tidak punya `<a>`).",
  },

  // ═══════════════════ HARD ═══════════════════

  {
    id: "h-css-1", level: "Hard", engine: "css",
    title: "CSS — :has() untuk pilih parent berdasarkan child",
    html:
`<div class="card">
  <h3>Produk Biasa</h3>
  <span class="price">Rp 120.000</span>
</div>
<div class="card">
  <h3>Produk Sale!</h3>
  <span class="price">Rp 80.000</span>
  <span class="badge-sale">SALE</span>
</div>
<div class="card">
  <h3>Produk Baru</h3>
  <span class="price">Rp 200.000</span>
  <span class="badge-new">NEW</span>
</div>`,
    intro:
`\`:has()\` adalah pseudo-class modern yang memilih elemen **berdasarkan isinya** — artinya kita bisa "naik ke parent" dengan CSS!

\`div:has(.badge-sale)\` → pilih \`<div>\` yang di dalamnya ada elemen ber-class \`badge-sale\`.

Dukungan: Chrome 105+, Firefox 121+, Safari 15.4+. Belum tersedia di BeautifulSoup (pakai XPath atau filter manual).`,
    goal: "Pilih seluruh card yang memiliki badge SALE.",
    answer: { engine: "css", expr: ".card:has(.badge-sale)" },
    why: "`.card:has(.badge-sale)` memilih seluruh div card yang mengandung `.badge-sale` — hanya satu kartu sale.",
    tip: "Setara XPath: `//div[@class='card'][.//span[@class='badge-sale']]`. Di BeautifulSoup, filter manual: `[c for c in soup.select('.card') if c.select_one('.badge-sale')]`.",
  },

  {
    id: "h-css-2", level: "Hard", engine: "css",
    title: "CSS — :first-child, :last-child, :only-child",
    html:
`<ul class="reviews">
  <li class="review">Review pertama ⭐⭐⭐⭐⭐</li>
  <li class="review">Review kedua ⭐⭐⭐⭐</li>
  <li class="review">Review terakhir ⭐⭐⭐</li>
</ul>
<ul class="highlights">
  <li class="highlight">Fitur unggulan</li>
</ul>`,
    intro:
`Pseudo-class posisi berbasis struktur:

- \`:first-child\` — elemen pertama dalam parent-nya
- \`:last-child\` — elemen terakhir
- \`:only-child\` — elemen yang **satu-satunya** anak (tidak punya sibling)

Mereka menghitung **semua** sibling, bukan hanya sibling tag sejenis.`,
    goal: "Pilih elemen <li> yang merupakan anak tunggal (tidak punya sibling li).",
    answer: { engine: "css", expr: "li:only-child" },
    why: "`li:only-child` hanya cocok dengan `<li class=\"highlight\">` di `<ul class=\"highlights\">` karena ia satu-satunya anak.",
    tip: "Jika butuh \"satu-satunya dari tag sejenis\", pakai `:only-of-type`.",
  },

  {
    id: "h-css-3", level: "Hard", engine: "css",
    title: "CSS — Rantai selector kompleks multi-level",
    html:
`<section class="results">
  <div class="product-row">
    <article class="card in-stock">
      <h4>Kamera Mirrorless</h4>
      <span class="price">Rp 12.000.000</span>
    </article>
    <article class="card out-of-stock">
      <h4>Lensa 50mm</h4>
      <span class="price">Rp 4.500.000</span>
    </article>
  </div>
  <div class="product-row">
    <article class="card in-stock">
      <h4>Flash External</h4>
      <span class="price">Rp 1.800.000</span>
    </article>
  </div>
</section>`,
    intro:
`Selector bisa dirantai panjang untuk target yang spesifik. Kemampuan membaca dan menulis rantai panjang adalah skill penting saat DOM sangat bersarang.`,
    goal: "Pilih hanya <span class=\"price\"> di dalam card yang IN STOCK.",
    answer: { engine: "css", expr: ".card.in-stock .price" },
    why: "`.card.in-stock` memilih article dengan **dua class sekaligus** (in-stock dan card). Spasi + `.price` turun ke span harga. Dua elemen in-stock terpilih.",
    tip: "Dua class berurutan tanpa spasi: `.a.b` = elemen yang punya class `a` DAN `b`. Beda dengan `.a .b` (descendant).",
  },

  {
    id: "h-css-4", level: "Hard", engine: "css",
    title: "CSS — Kolom tabel terakhir di baris non-header",
    html:
`<table class="orders">
  <thead>
    <tr><th>Order ID</th><th>Produk</th><th>Status</th></tr>
  </thead>
  <tbody>
    <tr><td>#1001</td><td>Laptop</td><td>Selesai</td></tr>
    <tr><td>#1002</td><td>Mouse</td><td>Dikirim</td></tr>
    <tr><td>#1003</td><td>Keyboard</td><td>Proses</td></tr>
  </tbody>
</table>`,
    intro:
`Tantangan nyata: ambil kolom "Status" (kolom terakhir) dari semua baris data, tanpa header.

Kuncinya: manfaatkan \`tbody\` (browser otomatis menyisipkannya), \`:last-child\` untuk kolom terakhir.`,
    goal: "Pilih semua <td> kolom terakhir dari baris data (bukan header).",
    answer: { engine: "css", expr: "tbody tr td:last-child" },
    why: "`tbody tr` memastikan kita di baris data (bukan `thead`). `td:last-child` mengambil sel terakhir tiap baris.",
    tip: "AWAS: di XPath, `//table/tr` biasanya **kosong** karena browser menyisipkan `<tbody>` di antara `<table>` dan `<tr>`. Pakai `//tbody/tr` atau `//table//tr`.",
  },

  {
    id: "h-css-5", level: "Hard", engine: "css",
    title: "CSS — :is() menyederhanakan selector berulang",
    html:
`<div class="page">
  <article class="featured">
    <h2>Artikel Utama</h2>
    <p>Konten artikel unggulan...</p>
  </article>
  <article class="new">
    <h2>Artikel Terbaru</h2>
    <p>Konten artikel baru...</p>
  </article>
  <article class="regular">
    <h2>Artikel Biasa</h2>
    <p>Konten biasa...</p>
  </article>
</div>`,
    intro:
`\`:is()\` menyederhanakan daftar selector yang berulang.

Tanpa \`:is()\`: \`article.featured h2, article.new h2\`
Dengan \`:is()\`: \`article:is(.featured, .new) h2\`

Lebih ringkas dan mudah dibaca, khususnya untuk selector panjang.`,
    goal: "Pilih <h2> yang berada di dalam article featured ATAU new.",
    answer: { engine: "css", expr: "article:is(.featured, .new) h2" },
    why: "`article:is(.featured, .new)` cocok dengan dua article pertama. Descendant `h2` lalu mengambil judul mereka.",
    tip: "`article.featured h2, article.new h2` adalah setara yang selalu didukung. `:is()` berguna saat daftar variannya banyak.",
  },

  {
    id: "h-xpath-1", level: "Hard", engine: "xpath",
    title: "XPath — Masalah nyata: class hash/acak",
    html:
`<div class="sc-f0a3 Pk9xQ" data-testid="product-card">
  <h2 class="sc-9b2e tT1">Wireless Earbuds Pro</h2>
  <div class="sc-7c11 Lmn">
    <span class="sc-aa0 lbl">Price</span>
    <span class="sc-bb1 kdok">Rp 899.000</span>
  </div>
  <button class="sc-zz9 q2">Add to cart</button>
</div>`,
    intro:
`E-commerce modern (React/styled-components, Tailwind JIT) menghasilkan class **hash acak** seperti \`Pk9xQ\` atau \`kdok\` yang **berubah tiap deploy**. Menarget class itu = scraper-mu cepat rusak.

Strategi: **jangkar ke yang stabil** — teks label, \`data-testid\`, \`itemprop\`, atau *struktur*.`,
    goal: "Pilih elemen harga (Rp 899.000) TANPA memakai class hash.",
    answer: { engine: "xpath", expr: "//span[normalize-space()='Price']/following-sibling::span[1]" },
    why: "Label teks \"Price\" stabil. `following-sibling::span[1]` mengambil span berikutnya = nilai harga.",
    tip: "Alternatif: `//div[@data-testid='product-card']//span[last()]` atau CSS `[data-testid='product-card'] span:last-child`.",
  },

  {
    id: "h-xpath-2", level: "Hard", engine: "xpath",
    title: "XPath — Class hash dengan kata utuh (normalize+concat)",
    html:
`<div class="sc-1a card featured" data-id="101">Produk A</div>
<div class="sc-1b card" data-id="102">Produk B</div>
<div class="sc-1c card-wrapper" data-id="103">Bukan Kartu</div>`,
    intro:
`\`contains(@class, 'card')\` akan juga mencocokkan \`card-wrapper\` — karena *mengandung* substring "card".

Untuk mencocokkan **kata utuh** (seperti CSS \`.card\`), gunakan trik spasi:

\`contains(concat(' ', normalize-space(@class), ' '), ' card ')\`

Tambahkan spasi di awal dan akhir class (via concat), lalu cari ' card ' (dengan spasi di kedua sisi).`,
    goal: "Pilih div yang class-nya mengandung KATA UTUH \"card\" (bukan card-wrapper).",
    answer: { engine: "xpath", expr: "//div[contains(concat(' ',normalize-space(@class),' '),' card ')]" },
    why: "Class `card-wrapper` tidak cocok karena stringnya menjadi `' sc-1c card-wrapper '` — tidak ada `' card '` di sana.",
    tip: "Ini adalah idiom XPath 1.0 standar untuk pencocokan class kata utuh. Di XPath 2.0 ada `tokenize()` yang lebih bersih.",
  },

  {
    id: "h-xpath-3", level: "Hard", engine: "xpath",
    title: "XPath — Naik ke parent/ancestor",
    html:
`<div class="sc-f0a3 Pk9xQ" data-testid="product-card">
  <h2 class="sc-9b2e tT1">Wireless Earbuds Pro</h2>
  <div class="sc-7c11 Lmn">
    <span class="sc-aa0 lbl">Price</span>
    <span class="sc-bb1 kdok">Rp 899.000</span>
  </div>
  <button class="sc-zz9 q2">Add to cart</button>
</div>`,
    intro:
`CSS klasik tidak bisa naik (selain \`:has()\` modern). XPath bisa dengan:

- \`parent::*\` — parent langsung
- \`parent::div\` — parent langsung yang bertag div
- \`ancestor::*[@data-testid]\` — leluhur manapun yang punya atribut data-testid

Pola: **cari yang mudah → naik ke kontainer → ambil data**.`,
    goal: "Dari tombol \"Add to cart\", ambil SELURUH kartu produknya.",
    answer: { engine: "xpath", expr: "//button[normalize-space()='Add to cart']/ancestor::*[@data-testid='product-card']" },
    why: "Jangkar ke tombol (teks stabil), lalu naik ke ancestor yang punya `data-testid='product-card'`.",
    tip: "`parent::` hanya satu langkah naik. `ancestor::` naik berapa pun lapis sampai cocok. Lebih aman pakai `ancestor` jika tidak tahu persis berapa level.",
  },

  {
    id: "h-xpath-4", level: "Hard", engine: "xpath",
    title: "XPath — Predikat gabungan (and / or)",
    html:
`<div class="product" data-stock="in" data-new="true">Laptop i9 (Baru + Tersedia)</div>
<div class="product" data-stock="out" data-new="true">Mouse Gaming (Baru, Habis)</div>
<div class="product" data-stock="in" data-new="false">Keyboard (Tersedia)</div>
<div class="product" data-stock="out" data-new="false">Monitor (Habis)</div>`,
    intro:
`Predikat XPath bisa digabungkan dengan \`and\` dan \`or\`:

- \`[@data-stock='in' and @data-new='true']\` — dua kondisi harus terpenuhi
- \`[@data-stock='out' or @data-new='true']\` — salah satu saja cukup
- Gunakan \`not()\` untuk negasi: \`[not(@data-stock='out')]\``,
    goal: "Pilih produk yang tersedia (data-stock='in') DAN merupakan barang baru (data-new='true').",
    answer: { engine: "xpath", expr: "//div[@data-stock='in' and @data-new='true']" },
    why: "Hanya elemen pertama memenuhi kedua syarat. Tiga lainnya gugur karena satu kondisi tidak terpenuhi.",
    tip: "CSS tidak punya `and`/`or` eksplisit. Untuk `and` pakai chaining: `[data-stock='in'][data-new='true']`. Untuk `or` tidak ada padanannya di CSS.",
  },

  {
    id: "h-xpath-5", level: "Hard", engine: "xpath",
    title: "XPath — Gabungan: jangkar → naik → turun",
    html:
`<section>
  <div class="sc-1 aQ" data-testid="product-card">
    <h2 class="sc-t">Earbuds Pro</h2>
    <div class="sc-r">
      <span class="sc-l">Price</span>
      <span class="sc-v">Rp 899.000</span>
    </div>
  </div>
  <div class="sc-1 bW" data-testid="product-card">
    <h2 class="sc-t">USB-C Hub 7-in-1</h2>
    <div class="sc-r">
      <span class="sc-l">Price</span>
      <span class="sc-v">Rp 320.000</span>
    </div>
  </div>
</section>`,
    intro:
`Kasus penutup — semua class hash, banyak kartu. Ambil **harga dari kartu tertentu** yang dikenali lewat judulnya.

**4 langkah tree-walk:**
1. Jangkar ke teks judul
2. Naik ke kartu (\`ancestor\`)
3. Turun lagi cari label "Price"
4. Ambil sibling harga`,
    goal: "Ambil harga dari kartu yang judulnya mengandung \"USB-C\".",
    answer: {
      engine: "xpath",
      expr: "//h2[contains(.,'USB-C')]/ancestor::*[@data-testid='product-card']//span[normalize-space()='Price']/following-sibling::span[1]",
    },
    why: "(1) `//h2[contains(.,'USB-C')]` temukan judul. (2) `ancestor::*[@data-testid='product-card']` naik ke kartu. (3) `//span[normalize-space()='Price']` turun ke label. (4) `following-sibling::span[1]` ambil harga → Rp 320.000.",
    tip: "Inilah cara scraping DOM ber-class hash secara andal: berpikir dalam *pohon* (atas-bawah-samping), bukan string class.",
  },
];
