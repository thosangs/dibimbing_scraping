<script setup lang="ts">
import { useNav } from '@slidev/client'

// Slidev serves built assets under this base; the exported PDF lives next to index.html.
const base = import.meta.env.BASE_URL
// Hide the button while exporting/printing so it never gets baked into the PDF.
const { isPrintMode } = useNav()
</script>

<template>
  <a
    v-if="!isPrintMode"
    class="pdf-download-btn print:hidden"
    :href="`${base}slides.pdf`"
    target="_blank"
    rel="noopener"
    title="Download these slides as a PDF"
    aria-label="Download slides as PDF"
  >
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 3v12" />
      <path d="m7 11 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
    <span>Download PDF</span>
  </a>
</template>

<style>
.pdf-download-btn {
  position: fixed;
  top: 14px;
  right: 16px;
  z-index: 60;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 14px;
  font-size: 12.5px;
  font-weight: 600;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  color: #0a1024;
  background: linear-gradient(95deg, #f0d99a, #c9a24a);
  border-radius: 999px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
  text-decoration: none;
  opacity: 0.82;
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.pdf-download-btn:hover {
  opacity: 1;
  transform: translateY(-1px);
}
</style>
