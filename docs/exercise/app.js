(() => {
  "use strict";
  const DATA = window.EXERCISE_DATA || {};
  const LESSONS = window.EXERCISE_LESSONS || [];
  const LS_KEY = "dibimbing_exercise_v1";
  const HL_ATTR = "data-exhl";
  const HL_STYLE =
    `[${HL_ATTR}]{outline:3px solid #c9a24a !important;outline-offset:1px;` +
    `background:rgba(201,162,74,.22) !important;border-radius:2px;}`;
  // Readable base styling for the small lesson snapshots (kept out of the source view).
  const LESSON_BASE = `<style>
 body{font-family:system-ui,-apple-system,Arial,sans-serif;padding:18px;color:#1f2430;background:#fff;line-height:1.55}
 h1{font-size:20px;margin-bottom:8px} h2{font-size:17px;margin:4px 0} h3{margin:4px 0}
 [data-testid],.product,.card,article{border:1px solid #e3e6ef;border-radius:8px;padding:12px;margin:8px 0}
 button{margin-top:8px;padding:6px 12px;border:1px solid #1a3b6e;background:#1a3b6e;color:#fff;border-radius:6px;font:inherit;cursor:pointer}
 table{border-collapse:collapse;margin-top:8px} th,td{border:1px solid #d7dbe8;padding:6px 12px;text-align:left} th{background:#f3f5fb}
 ul{margin-left:18px} a{color:#1a3b6e}
 .badges span,.tag{display:inline-block;margin:2px;padding:3px 9px;border-radius:999px;background:#eef1f8}
</style>`;

  // ---------- state ----------
  let mode = "materi";
  let engine = "css";          // current engine for the active input
  let pageId = null;
  let rawHtml = "";            // current display source (practice page or pasted)
  let activeTaskId = null;
  let view = "preview";
  let lessonIdx = 0;
  let lessonRaw = "";          // current lesson snapshot HTML
  let lessonFilter = "all";   // 'all' | 'css' | 'xpath'
  let lessonEngine = "css";   // engine the student is currently trying with

  // ---------- dom ----------
  const $ = (id) => document.getElementById(id);
  const els = {
    pageSelect: $("page-select"), pageBlurb: $("page-blurb"),
    taskList: $("task-list"), taskActive: $("task-active"),
    activeNum: $("active-num"), activePrompt: $("active-prompt"),
    activeHint: $("active-hint"), hintWrap: $("active-hint-wrap"),
    selectorInput: $("selector-input"), btnRun: $("btn-run"), btnCheck: $("btn-check"),
    feedback: $("feedback"), output: $("output"), btnReset: $("btn-reset"),
    progressFill: $("progress-fill"), progressLabel: $("progress-label"),
    pasteHtml: $("paste-html"), btnLoadHtml: $("btn-load-html"), btnSample: $("btn-sample"),
    pgInput: $("pg-selector-input"), pgRun: $("pg-btn-run"), pgFeedback: $("pg-feedback"), pgOutput: $("pg-output"),
    preview: $("preview"), source: $("source"), sourceCode: $("source-code"),
    displayTitle: $("display-title"), matchNote: $("match-note"),
    // materi
    lessonList: $("lesson-list"),
    lessonLevel: $("lesson-level"), lessonTitle: $("lesson-title"),
    lessonIntro: $("lesson-intro"), lessonGoal: $("lesson-goal"),
    lessonInput: $("lesson-input"), lessonRun: $("lesson-run"), lessonReveal: $("lesson-reveal"),
    lessonAnswer: $("lesson-answer"), lessonOutput: $("lesson-output"),
    lessonPrev: $("lesson-prev"), lessonNext: $("lesson-next"),
    lessonProgressFill: $("lesson-progress-fill"), lessonProgressLabel: $("lesson-progress-label"),
    lessonAnsHint: $("lesson-ans-hint"),
    lfCount: $("lf-count"),
    engineToggle: $("engine-toggle"),
    taskPrev: $("task-prev"), taskNext: $("task-next"),
  };

  // ---------- storage ----------
  const loadProgress = () => {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
    catch { return {}; }
  };
  const saveProgress = (p) => localStorage.setItem(LS_KEY, JSON.stringify(p));
  let progress = loadProgress();
  const taskState = (pid, tid) => (progress[pid] && progress[pid][tid]) || null;
  const setTaskState = (pid, tid, patch) => {
    progress[pid] = progress[pid] || {};
    progress[pid][tid] = Object.assign({}, progress[pid][tid], patch, { ts: Date.now() });
    saveProgress(progress);
  };

  // ---------- selector engines ----------
  function parseDoc(html) {
    return new DOMParser().parseFromString(html, "text/html");
  }
  // Returns { nodes: [...] } or throws Error with a friendly message.
  function runQuery(doc, eng, expr) {
    expr = (expr || "").trim();
    if (!expr) throw new Error("Selector masih kosong.");
    if (eng === "css") {
      let list;
      try { list = doc.querySelectorAll(expr); }
      catch (e) { throw new Error("CSS selector tidak valid."); }
      return Array.from(list);
    } else {
      let res;
      try {
        res = doc.evaluate(expr, doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      } catch (e) { throw new Error("XPath tidak valid."); }
      const out = [];
      for (let i = 0; i < res.snapshotLength; i++) {
        const n = res.snapshotItem(i);
        if (n && n.nodeType === 1) out.push(n); // elements only
      }
      return out;
    }
  }

  function sameNodeSet(a, b) {
    if (a.length !== b.length) return false;
    const sa = new Set(a);
    return b.every((n) => sa.has(n));
  }

  // ---------- preview / source rendering ----------
  function renderDisplay(html, hl, sourceOverride) {
    // hl = { engine, expr } to highlight, or null
    // sourceOverride = clean HTML to show in the source view (defaults to html)
    const doc = parseDoc(html);
    let matched = [];
    if (hl) {
      try { matched = runQuery(doc, hl.engine, hl.expr); } catch { matched = []; }
      matched.forEach((n) => n.setAttribute(HL_ATTR, "1"));
    }
    const style = doc.createElement("style");
    style.textContent = HL_STYLE;
    (doc.head || doc.documentElement).appendChild(style);
    els.preview.srcdoc = "<!DOCTYPE html>" + doc.documentElement.outerHTML;
    // source view (from the original html, no highlight markup)
    els.sourceCode.textContent = (sourceOverride != null) ? sourceOverride : html;
    return matched.length;
  }

  function describeMatches(nodes) {
    if (!nodes.length) {
      els._target.innerHTML = '<div class="output-empty">0 elemen cocok.</div>';
      return;
    }
    const frag = document.createDocumentFragment();
    nodes.slice(0, 40).forEach((n, i) => {
      const div = document.createElement("div");
      div.className = "match";
      const cls = n.getAttribute("class");
      const tag = "<" + n.tagName.toLowerCase() + (cls ? "." + cls.trim().split(/\s+/).join(".") : "") + ">";
      const text = (n.textContent || "").replace(/\s+/g, " ").trim();
      const href = n.getAttribute("href");
      let attr = "";
      if (href) attr = ` href="${href}"`;
      div.innerHTML =
        `<span class="mtag">#${i + 1} ${escapeHtml(tag)}</span>` +
        (attr ? `<span class="mattr">${escapeHtml(attr)}</span>` : "") +
        (text ? `<span class="mtext">${escapeHtml(text.slice(0, 160))}${text.length > 160 ? "…" : ""}</span>` : "");
      frag.appendChild(div);
    });
    if (nodes.length > 40) {
      const more = document.createElement("div");
      more.className = "output-empty";
      more.textContent = `… dan ${nodes.length - 40} lagi`;
      frag.appendChild(more);
    }
    els._target.innerHTML = "";
    els._target.appendChild(frag);
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  // ---------- practice mode ----------
  function buildPageSelect() {
    els.pageSelect.innerHTML = "";
    Object.keys(DATA).forEach((pid) => {
      const opt = document.createElement("option");
      opt.value = pid; opt.textContent = DATA[pid].label;
      els.pageSelect.appendChild(opt);
    });
  }

  async function loadPage(pid) {
    pageId = pid;
    const page = DATA[pid];
    els.pageBlurb.textContent = page.blurb || "";
    els.displayTitle.textContent = page.label || "Display";
    try {
      const resp = await fetch(page.file, { cache: "no-cache" });
      rawHtml = await resp.text();
    } catch (e) {
      rawHtml = "<p style='font-family:sans-serif;padding:20px'>Gagal memuat halaman. Jalankan lewat http server, bukan file://.</p>";
    }
    renderDisplay(rawHtml, null);
    renderTaskList();
    updateProgress();
    // select first unsolved task, else first
    const firstUnsolved = page.tasks.find((t) => {
      const st = taskState(pid, t.id);
      return !st || st.status !== "correct";
    });
    selectTask((firstUnsolved || page.tasks[0]).id);
  }

  function renderTaskList() {
    const page = DATA[pageId];
    els.taskList.innerHTML = "";
    page.tasks.forEach((t, idx) => {
      const li = document.createElement("li");
      li.className = "task-item" + (t.id === activeTaskId ? " is-active" : "");
      li.dataset.id = t.id;
      const st = taskState(pageId, t.id);
      const status = st ? st.status : null;
      const badge = status === "correct" ? "✓" : status === "wrong" ? "✕" : (idx + 1);
      li.innerHTML =
        `<span class="task-status ${status || ""}">${badge}</span>` +
        `<span class="ttext">${escapeHtml(t.prompt)}</span>`;
      li.addEventListener("click", () => selectTask(t.id));
      els.taskList.appendChild(li);
    });
  }

  function selectTask(tid) {
    activeTaskId = tid;
    const page = DATA[pageId];
    const idx = page.tasks.findIndex((t) => t.id === tid);
    const task = page.tasks[idx];
    els.taskActive.hidden = false;
    els.activeNum.textContent = idx + 1;
    els.activePrompt.textContent = task.prompt;
    els.activeHint.textContent = task.hint || "";
    els.hintWrap.open = false;
    els.feedback.hidden = true;
    els._target = els.output;
    els.output.innerHTML = "";
    if (els.taskPrev) els.taskPrev.disabled = idx <= 0;
    if (els.taskNext) els.taskNext.disabled = idx >= page.tasks.length - 1;
    const st = taskState(pageId, tid);
    if (st && st.input) {
      els.selectorInput.value = st.input;
      if (st.engine) setEngine(st.engine);
    } else {
      els.selectorInput.value = "";
    }
    renderTaskList();
    // reset preview highlight to none for the fresh task
    renderDisplay(rawHtml, null);
    els.selectorInput.focus();
  }

  function practiceRun() {
    const expr = els.selectorInput.value;
    els._target = els.output;
    try {
      const count = renderDisplay(rawHtml, { engine, expr });
      const nodes = runQuery(parseDoc(rawHtml), engine, expr);
      describeMatches(nodes);
      els.feedback.hidden = true;
    } catch (e) {
      renderDisplay(rawHtml, null);
      showFeedback(els.feedback, "bad", e.message);
      els.output.innerHTML = "";
    }
  }

  function practiceCheck() {
    const page = DATA[pageId];
    const task = page.tasks.find((t) => t.id === activeTaskId);
    const expr = els.selectorInput.value;
    els._target = els.output;
    const doc = parseDoc(rawHtml);
    let stu, ref;
    try { stu = runQuery(doc, engine, expr); }
    catch (e) { showFeedback(els.feedback, "bad", e.message); return; }
    try { ref = runQuery(doc, task.ref.engine, task.ref.expr); }
    catch (e) { showFeedback(els.feedback, "bad", "Reference error: " + e.message); return; }

    renderDisplay(rawHtml, { engine, expr });
    describeMatches(runQuery(parseDoc(rawHtml), engine, expr));

    if (sameNodeSet(stu, ref)) {
      setTaskState(pageId, activeTaskId, { status: "correct", input: expr, engine });
      showFeedback(els.feedback, "ok", `Benar! ${stu.length} elemen — persis sesuai target.`);
    } else {
      setTaskState(pageId, activeTaskId, { status: "wrong", input: expr, engine });
      const diff = stu.length === ref.length
        ? `Jumlahnya sama (${stu.length}) tapi elemen yang kepilih beda.`
        : `Kamu dapat ${stu.length} elemen, target ${ref.length}.`;
      showFeedback(els.feedback, "bad", `Belum pas. ${diff} Coba lihat hint.`);
    }
    renderTaskList();
    updateProgress();
  }

  function updateProgress() {
    const page = DATA[pageId];
    const total = page.tasks.length;
    const done = page.tasks.filter((t) => {
      const st = taskState(pageId, t.id);
      return st && st.status === "correct";
    }).length;
    els.progressFill.style.width = total ? `${(done / total) * 100}%` : "0%";
    els.progressLabel.textContent = `${done}/${total}`;
  }

  function gotoTask(delta) {
    const page = DATA[pageId];
    if (!page) return;
    const idx = page.tasks.findIndex((t) => t.id === activeTaskId);
    const ni = idx + delta;
    if (ni >= 0 && ni < page.tasks.length) selectTask(page.tasks[ni].id);
  }

  function resetPage() {
    if (!pageId) return;
    if (progress[pageId]) { delete progress[pageId]; saveProgress(progress); }
    selectTask(DATA[pageId].tasks[0].id);
    renderTaskList();
    updateProgress();
  }

  // ---------- playground ----------
  const SAMPLE = `<ul class="cart">
  <li class="item" data-sku="A1"><span class="name">Helmet</span><span class="price">£24.99</span></li>
  <li class="item sale" data-sku="B2"><span class="name">Bike Lock</span><span class="price">£12.50</span></li>
  <li class="item" data-sku="C3"><span class="name">Water Bottle</span><span class="price">£6.00</span></li>
</ul>`;

  function loadPasted() {
    rawHtml = els.pasteHtml.value.trim() || "<p style='font-family:sans-serif;padding:20px;color:#777'>Tempel HTML lalu Load.</p>";
    renderDisplay(rawHtml, null);
    els._target = els.pgOutput;
    els.pgOutput.innerHTML = "";
    els.pgFeedback.hidden = true;
  }

  function playgroundRun() {
    const expr = els.pgInput.value;
    els._target = els.pgOutput;
    try {
      renderDisplay(rawHtml, { engine, expr });
      describeMatches(runQuery(parseDoc(rawHtml), engine, expr));
      els.pgFeedback.hidden = true;
    } catch (e) {
      renderDisplay(rawHtml, null);
      showFeedback(els.pgFeedback, "bad", e.message);
      els.pgOutput.innerHTML = "";
    }
  }

  // ---------- materi (lessons) ----------
  function mdInline(t) {
    let s = escapeHtml(t);
    s = s.replace(/`([^`]+)`/g, (m, c) => `<code>${c}</code>`);
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return s;
  }
  function mdBlocks(t) {
    return t.split(/\n\n+/).map((block) => {
      if (/^\s*-\s+/.test(block)) {
        const items = block.split(/\n/).filter((l) => l.trim())
          .map((l) => `<li>${mdInline(l.replace(/^\s*-\s+/, ""))}</li>`).join("");
        return `<ul>${items}</ul>`;
      }
      return `<p>${mdInline(block)}</p>`;
    }).join("");
  }

  function setLessonEngine(eng) {
    lessonEngine = eng;
    document.querySelectorAll(".leng-btn").forEach((b) =>
      b.classList.toggle("is-active", b.dataset.leng === eng));
    const ls = LESSONS[lessonIdx];
    if (els.lessonAnsHint) {
      els.lessonAnsHint.textContent = ls
        ? (eng === ls.answer.engine ? "" : `jawaban pakai ${ls.answer.engine.toUpperCase()}`)
        : "";
    }
    const ph = eng === "css"
      ? "mis. .price  ·  span.title  ·  a[href^=\"/p/\"]"
      : "mis. //h3  ·  //span[@class=\"price\"]  ·  //td[1]";
    if (els.lessonInput) els.lessonInput.placeholder = "coba sendiri — " + ph;
  }

  function filteredLessons() {
    return LESSONS.filter((ls) => lessonFilter === "all" || ls.engine === lessonFilter);
  }

  function setLessonFilter(f) {
    lessonFilter = f;
    document.querySelectorAll(".lf-btn").forEach((b) =>
      b.classList.toggle("is-active", b.dataset.lf === f));
    const visible = filteredLessons();
    if (els.lfCount) els.lfCount.textContent = `${visible.length} lesson`;
    // if current lesson is not in the filtered set, jump to first visible
    const cur = LESSONS[lessonIdx];
    if (cur && !visible.includes(cur) && visible.length > 0) {
      selectLesson(LESSONS.indexOf(visible[0]));
    } else {
      buildLessonList();
    }
  }

  function buildLessonList() {
    const visible = filteredLessons();
    els.lessonList.innerHTML = "";
    visible.forEach((ls, visIdx) => {
      const i = LESSONS.indexOf(ls);
      const li = document.createElement("li");
      const isActive = i === lessonIdx;
      li.className = "lesson-item" + (isActive ? " is-active" : "");
      const st = taskState("_lessons", ls.id);
      if (st && st.revealed) li.classList.add("done");
      const num = st && st.revealed ? "✓" : (visIdx + 1);
      li.innerHTML =
        `<span class="lnum">${num}</span>` +
        `<span class="eng-dot ${ls.engine}"></span>` +
        `<span class="level-badge ${ls.level}">${ls.level}</span>` +
        `<span class="ltext">${escapeHtml(ls.title)}</span>`;
      li.addEventListener("click", () => selectLesson(i));
      els.lessonList.appendChild(li);
    });
    if (els.lfCount) els.lfCount.textContent = `${visible.length} lesson`;
  }

  function selectLesson(i) {
    lessonIdx = i;
    const ls = LESSONS[i];
    lessonRaw = ls.html;
    els.lessonLevel.className = "level-badge " + ls.level;
    els.lessonLevel.textContent = ls.level;
    els.lessonTitle.textContent = ls.title;
    els.lessonIntro.innerHTML = mdBlocks(ls.intro);
    els.lessonGoal.innerHTML = mdInline(ls.goal);
    els.lessonInput.value = "";
    els.lessonAnswer.hidden = true;
    els.lessonAnswer.innerHTML = "";
    els._target = els.lessonOutput;
    els.lessonOutput.innerHTML = "";
    // Default try-engine to this lesson's answer engine
    setLessonEngine(ls.answer.engine);
    // Prev/Next within the filtered set
    const visible = filteredLessons();
    const visIdx = visible.indexOf(ls);
    els.lessonPrev.disabled = visIdx <= 0;
    els.lessonNext.disabled = visIdx >= visible.length - 1;
    els.displayTitle.textContent = ls.title;
    renderDisplay(LESSON_BASE + lessonRaw, null, lessonRaw);
    setView("preview");
    buildLessonList();
  }

  function lessonRun() {
    const expr = els.lessonInput.value;
    const eng = lessonEngine;        // run with whatever engine the student chose
    els._target = els.lessonOutput;
    try {
      renderDisplay(LESSON_BASE + lessonRaw, { engine: eng, expr }, lessonRaw);
      describeMatches(runQuery(parseDoc(LESSON_BASE + lessonRaw), eng, expr));
    } catch (e) {
      renderDisplay(LESSON_BASE + lessonRaw, null, lessonRaw);
      els.lessonOutput.innerHTML = `<div class="output-empty">${escapeHtml(e.message)}</div>`;
    }
  }

  function lessonReveal() {
    const ls = LESSONS[lessonIdx];
    const a = ls.answer;
    els.lessonInput.value = a.expr;
    els.lessonAnswer.hidden = false;
    els.lessonAnswer.innerHTML =
      `<div class="answer-label">Jawaban (${a.engine.toUpperCase()})</div>` +
      `<pre class="answer-code"><code>${escapeHtml(a.expr)}</code></pre>` +
      `<p class="answer-why">${mdInline(ls.why)}</p>` +
      (ls.tip ? `<p class="answer-tip">${mdInline(ls.tip)}</p>` : "");
    els._target = els.lessonOutput;
    try {
      renderDisplay(LESSON_BASE + lessonRaw, { engine: a.engine, expr: a.expr }, lessonRaw);
      describeMatches(runQuery(parseDoc(LESSON_BASE + lessonRaw), a.engine, a.expr));
    } catch (e) { /* answer is curated; ignore */ }
    setTaskState("_lessons", ls.id, { revealed: true });
    buildLessonList();
    updateLessonProgress();
  }

  function gotoLesson(delta) {
    const visible = filteredLessons();
    const cur = LESSONS[lessonIdx];
    const visIdx = visible.indexOf(cur);
    const ni = visIdx + delta;
    if (ni >= 0 && ni < visible.length) selectLesson(LESSONS.indexOf(visible[ni]));
  }

  function updateLessonProgress() {
    // Always counts across ALL lessons (not filtered)
    const total = LESSONS.length;
    const done = LESSONS.filter((ls) => {
      const st = taskState("_lessons", ls.id);
      return st && st.revealed;
    }).length;
    els.lessonProgressFill.style.width = total ? `${(done / total) * 100}%` : "0%";
    els.lessonProgressLabel.textContent = `${done}/${total}`;
  }

  // ---------- shared UI ----------
  function showFeedback(el, kind, msg) {
    el.hidden = false;
    el.className = "feedback " + kind;
    el.textContent = msg;
  }

  function setEngine(eng) {
    engine = eng;
    document.querySelectorAll(".eng-btn").forEach((b) =>
      b.classList.toggle("is-active", b.dataset.engine === eng));
    const ph = eng === "css" ? 'mis. article.product_pod  ·  .price_color' : 'mis. //article  ·  //*[@class="price"]';
    els.selectorInput.placeholder = ph;
    els.pgInput.placeholder = ph;
    if (els.lessonInput) els.lessonInput.placeholder = "coba sendiri — " + ph;
  }

  function setMode(m) {
    mode = m;
    document.querySelectorAll(".mode-tab").forEach((b) =>
      b.classList.toggle("is-active", b.dataset.mode === m));
    // Each mode has parts in the list column AND the submission column.
    document.querySelectorAll("[data-modepanel]").forEach((el) =>
      { el.hidden = el.dataset.modepanel !== m; });
    // Global engine toggle is only useful in Practice/Playground where students type freely.
    // In Materi each lesson defines its own engine — the badge shows it instead.
    if (els.engineToggle) els.engineToggle.style.display = m === "materi" ? "none" : "";
    if (m === "materi") {
      const ls = LESSONS[lessonIdx];
      els.displayTitle.textContent = ls ? ls.title : "Materi";
      renderDisplay(LESSON_BASE + lessonRaw, null, lessonRaw);
      setView("preview");
    } else if (m === "practice") {
      // Load the practice page on first entry (avoids painting it into the
      // shared preview while the user is still on Materi).
      if (!pageId) { loadPage(els.pageSelect.value); return; }
      els.displayTitle.textContent = DATA[pageId] ? DATA[pageId].label : "Display";
      renderDisplay(rawHtml, null);
    } else {
      els.displayTitle.textContent = "Pasted HTML";
      if (!els.pasteHtml.value) els.pasteHtml.value = SAMPLE;
      loadPasted();
    }
  }

  function setView(v) {
    view = v;
    document.querySelectorAll(".view-btn").forEach((b) =>
      b.classList.toggle("is-active", b.dataset.view === v));
    els.preview.hidden = v !== "preview";
    els.source.hidden = v !== "source";
  }

  // ---------- wire up ----------
  function init() {
    buildPageSelect();
    buildLessonList();
    setEngine("css");
    document.querySelectorAll(".mode-tab").forEach((b) =>
      b.addEventListener("click", () => setMode(b.dataset.mode)));
    document.querySelectorAll(".eng-btn").forEach((b) =>
      b.addEventListener("click", () => setEngine(b.dataset.engine)));
    document.querySelectorAll(".view-btn").forEach((b) =>
      b.addEventListener("click", () => setView(b.dataset.view)));

    els.pageSelect.addEventListener("change", () => loadPage(els.pageSelect.value));
    els.btnRun.addEventListener("click", practiceRun);
    els.btnCheck.addEventListener("click", practiceCheck);
    els.btnReset.addEventListener("click", resetPage);
    els.selectorInput.addEventListener("keydown", (e) => { if (e.key === "Enter") practiceCheck(); });
    if (els.taskPrev) els.taskPrev.addEventListener("click", () => gotoTask(-1));
    if (els.taskNext) els.taskNext.addEventListener("click", () => gotoTask(1));

    els.btnLoadHtml.addEventListener("click", loadPasted);
    els.btnSample.addEventListener("click", () => { els.pasteHtml.value = SAMPLE; loadPasted(); });
    els.pgRun.addEventListener("click", playgroundRun);
    els.pgInput.addEventListener("keydown", (e) => { if (e.key === "Enter") playgroundRun(); });

    els.lessonRun.addEventListener("click", lessonRun);
    els.lessonReveal.addEventListener("click", lessonReveal);
    els.lessonPrev.addEventListener("click", () => gotoLesson(-1));
    els.lessonNext.addEventListener("click", () => gotoLesson(1));
    els.lessonInput.addEventListener("keydown", (e) => { if (e.key === "Enter") lessonRun(); });
    document.querySelectorAll(".lf-btn").forEach((b) =>
      b.addEventListener("click", () => setLessonFilter(b.dataset.lf)));
    document.querySelectorAll(".leng-btn").forEach((b) =>
      b.addEventListener("click", () => setLessonEngine(b.dataset.leng)));

    updateLessonProgress();

    // Land on Materi. The practice page loads lazily on first switch to Latihan.
    if (LESSONS.length) selectLesson(0);
    setMode("materi");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
