/**
 * app.js — GitDiffViewer main controller
 */
(function () {
  'use strict';

  const SAMPLE_A = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}

function applyDiscount(total, percent) {
  return total - (total * percent / 100);
}`;

  const SAMPLE_B = `function calculateTotal(items, tax = 0) {
  if (!items || !items.length) return 0;
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const taxAmount = subtotal * (tax / 100);
  return subtotal + taxAmount;
}

function applyDiscount(total, percent, cap = Infinity) {
  const discount = Math.min(total * percent / 100, cap);
  return total - discount;
}

function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}`;

  let currentDiff = null;
  let chunkIndex = 0;

  function computeDiff() {
    const a = document.getElementById('input-a').value;
    const b = document.getElementById('input-b').value;
    if (!a.trim() && !b.trim()) return;
    const ignoreWs = document.getElementById('toggle-whitespace').checked;
    currentDiff = DiffEngine.diffLines(a, b, ignoreWs);
    chunkIndex = 0;
    renderDiff();
    showStatsBar(a, b);
    document.getElementById('input-area').classList.add('hidden');
    document.getElementById('diff-area').classList.remove('hidden');
  }

  function renderDiff() {
    if (!currentDiff) return;
    const mode = document.getElementById('view-mode').value;
    const output = document.getElementById('diff-output');
    output.innerHTML = mode === 'split'
      ? DiffRenderer.renderSplit(currentDiff)
      : DiffRenderer.renderUnified(currentDiff);
    updateChunkNav();
  }

  function showStatsBar(a, b) {
    const bar = document.getElementById('stats-bar');
    bar.style.display = 'flex';
    document.getElementById('stat-files').textContent = '1 file';
    document.getElementById('stat-add').textContent = `+${currentDiff.stats.added}`;
    document.getElementById('stat-del').textContent = `-${currentDiff.stats.removed}`;
    document.getElementById('stat-chunks').textContent = `${currentDiff.hunks.length} chunks`;
  }

  function updateChunkNav() {
    const total = currentDiff ? currentDiff.hunks.length : 0;
    document.getElementById('chunk-counter').textContent = `Chunk ${total ? chunkIndex + 1 : 0}/${total}`;
  }

  function scrollToChunk(i) {
    const headers = document.querySelectorAll('.hunk-header');
    if (headers[i]) headers[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function init() {
    document.getElementById('btn-diff').addEventListener('click', computeDiff);
    document.getElementById('btn-sample').addEventListener('click', () => {
      document.getElementById('input-a').value = SAMPLE_A;
      document.getElementById('input-b').value = SAMPLE_B;
    });
    document.getElementById('btn-clear').addEventListener('click', () => {
      document.getElementById('input-a').value = '';
      document.getElementById('input-b').value = '';
    });
    document.getElementById('btn-back').addEventListener('click', () => {
      document.getElementById('diff-area').classList.add('hidden');
      document.getElementById('input-area').classList.remove('hidden');
      document.getElementById('stats-bar').style.display = 'none';
    });
    document.getElementById('view-mode').addEventListener('change', renderDiff);
    document.getElementById('theme-select').addEventListener('change', e => {
      document.body.className = `theme-${e.target.value}`;
    });
    document.getElementById('btn-next-chunk').addEventListener('click', () => {
      if (!currentDiff) return;
      chunkIndex = Math.min(chunkIndex + 1, currentDiff.hunks.length - 1);
      updateChunkNav(); scrollToChunk(chunkIndex);
    });
    document.getElementById('btn-prev-chunk').addEventListener('click', () => {
      if (!currentDiff) return;
      chunkIndex = Math.max(0, chunkIndex - 1);
      updateChunkNav(); scrollToChunk(chunkIndex);
    });
    document.getElementById('btn-copy-diff').addEventListener('click', () => {
      const a = document.getElementById('input-a').value;
      const b = document.getElementById('input-b').value;
      navigator.clipboard.writeText(`--- original\n+++ modified\n${a}\n---\n${b}`);
    });
    document.getElementById('btn-search').addEventListener('click', runSearch);
    document.getElementById('search-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') runSearch();
    });
    document.body.className = 'theme-dark';
  }

  function runSearch() {
    const q = document.getElementById('search-input').value;
    const container = document.getElementById('diff-output');
    const count = DiffSearch.search(q, container);
    document.getElementById('search-count').textContent = count ? `${count} found` : 'not found';
  }

  document.addEventListener('DOMContentLoaded', init);
})();
